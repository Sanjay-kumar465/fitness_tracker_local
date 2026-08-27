import React, { useState, useEffect } from 'react';
import { getUserNotifications } from '../api';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL or UNREAD

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getUserNotifications();
      setNotifications(data || []);
      setError(null);
    } catch (err) {
      setError('Unable to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const getFilteredNotifications = () => {
    if (filter === 'UNREAD') {
      return notifications.filter(n => !n.isRead);
    }
    return notifications;
  };

  const getNotificationTypeClass = (type) => {
    switch (type) {
      case 'ACHIEVED':
      case 'ACHIEVEMENT':
        return 'tag-active';
      case 'REMINDER':
      default:
        return 'tag-medium';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div className="app-header">
        <h1 className="page-title">Notifications</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${filter === 'ALL' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setFilter('ALL')}
          >
            All
          </button>
          <button
            className={`btn ${filter === 'UNREAD' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setFilter('UNREAD')}
          >
            Unread ({notifications.filter(n => !n.isRead).length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : getFilteredNotifications().length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
          <div className="empty-title">No notifications found</div>
          <div className="empty-subtitle">You are all caught up!</div>
        </div>
      ) : (
        <div className="goal-list">
          {getFilteredNotifications().map((notif) => (
            <div
              key={notif.id}
              className="goal-item"
              style={{
                borderLeft: notif.isRead ? '1px solid #DCD2CE' : '4px solid #eaff42',
                backgroundColor: notif.isRead ? '#FFFFFF' : 'rgba(214, 195, 188, 0.1)',
                padding: '20px',
              }}
            >
              <div className="item-info" style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '4px' }}>
                  <span className={`tag ${getNotificationTypeClass(notif.type)}`}>
                    {notif.type || 'System'}
                  </span>
                  <span style={{ fontSize: '12.8px', color: '#6B5E5B' }}>
                    {notif.createdDate ? notif.createdDate.replace('T', ' ').substring(0, 16) : ''}
                  </span>
                </div>
                <div style={{ fontSize: '15.2px', fontWeight: notif.isRead ? '400' : '600' }}>
                  {notif.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;

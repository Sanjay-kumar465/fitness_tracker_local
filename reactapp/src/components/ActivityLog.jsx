import React, { useState, useEffect } from 'react';
import { fetchEntries } from '../api';

const ActivityLog = ({ entries: propEntries, loading: propLoading, error: propError }) => {
  const [entries, setEntries] = useState(propEntries || []);
  const [loading, setLoading] = useState(propLoading !== undefined ? propLoading : (propEntries ? false : true));
  const [error, setError] = useState(propError || null);

  useEffect(() => {
    if (propEntries !== undefined) {
      setEntries(Array.isArray(propEntries) ? propEntries : []);
      setLoading(propLoading !== undefined ? propLoading : false);
      setError(propError || null);
      return;
    }

    let isMounted = true;
    const loadLog = async () => {
      try {
        setLoading(true);
        const data = await fetchEntries();
        if (isMounted) {
          if (Array.isArray(data)) {
            setEntries(data);
          } else {
            setEntries([]);
          }
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load activity logs');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadLog();
    window.addEventListener('mockDataLoaded', loadLog);
    return () => {
      isMounted = false;
      window.removeEventListener('mockDataLoaded', loadLog);
    };
  }, [propEntries, propLoading, propError]);

  return (
    <div className="content-card">
      <div className="card-header">
        <h3 className="card-title">Activity Log</h3>
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : entries.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24">
            <path d="M19 4h-3.18C15.42 2.21 13.88 1 12 1S8.58 2.21 8.18 4H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-7-1c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 15H7v-2h10v2zm0-4H7v-2h10v2zm-3-4H7V7h7v2z" />
          </svg>
          <div className="empty-title">No activities recorded</div>
          <div className="empty-subtitle">Your logged goals and activities will appear here.</div>
        </div>
      ) : (
        <div className="responsive-table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Goal Type</th>
                <th>Target Amount</th>
                <th>Achieved Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td style={{ fontWeight: '600' }}>{entry.goalType}</td>
                  <td>{entry.targetAmount}</td>
                  <td>{entry.achievedAmount}</td>
                  <td>{entry.date}</td>
                  <td>
                    <span
                      className={`tag ${
                        entry.achievedAmount >= entry.targetAmount ? 'tag-active' : 'tag-paused'
                      }`}
                    >
                      {entry.achievedAmount >= entry.targetAmount ? 'Completed' : 'In Progress'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;

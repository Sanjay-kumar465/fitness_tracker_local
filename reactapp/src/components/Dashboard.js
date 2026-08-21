import React, { useState, useEffect } from 'react';
import { fetchEntries } from '../api';

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
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
          setError('Failed to fetch progress entries');
          setEntries([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="content-card">
      <div className="card-header">
        <h2 className="page-title">Progress Dashboard</h2>
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
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z" />
          </svg>
          <div className="empty-title">No data yet</div>
          <div className="empty-subtitle">Get started by creating a new goal!</div>
        </div>
      ) : (
        <div className="item-list">
          {entries.map((entry) => (
            <div key={entry.id} className="goal-item">
              <div className="item-info">
                <span className="item-title">
                  {entry.goalType} - {entry.achievedAmount}/{entry.targetAmount}
                </span>
                <span className="item-details">Target Date: {entry.date}</span>
              </div>
              <div className="progress-bar-container" style={{ maxWidth: '200px' }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.min(
                      100,
                      entry.targetAmount > 0 ? (entry.achievedAmount / entry.targetAmount) * 100 : 0
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

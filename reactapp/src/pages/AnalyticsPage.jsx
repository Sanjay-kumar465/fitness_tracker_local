import React, { useState, useEffect } from 'react';
import { getAnalyticsSummary } from '../api';

const AnalyticsPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getAnalyticsSummary();
        setSummary(data);
        setError(null);
      } catch (err) {
        setError('Analytics data is currently unavailable.');
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div className="app-header">
          <h1 className="page-title">Premium Analytics</h1>
        </div>
        <div className="content-card" style={{ textAlign: 'center', padding: '48px' }}>
          <svg style={{ width: '48px', height: '48px', fill: '#6B5E5B', marginBottom: '16px' }} viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <p style={{ fontSize: '17.6px', fontWeight: '500', color: '#6B5E5B' }}>{error}</p>
        </div>
      </div>
    );
  }

  const { totalGoals = 0, totalWorkouts = 0, totalNutritionEntries = 0, totalProgressRecords = 0 } = summary || {};
  const maxVal = Math.max(totalGoals, totalWorkouts, totalNutritionEntries, totalProgressRecords, 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="app-header">
        <h1 className="page-title">Premium Analytics</h1>
        <span className="tag tag-active" style={{ fontSize: '12.8px', padding: '6.4px 12.8px' }}>Premium Active</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-highlight">
          <span className="stat-label">Total Goals</span>
          <span className="stat-value">{totalGoals}</span>
        </div>
        <div className="stat-card stat-highlight">
          <span className="stat-label">Total Workouts</span>
          <span className="stat-value">{totalWorkouts}</span>
        </div>
        <div className="stat-card stat-highlight">
          <span className="stat-label">Nutrition Entries</span>
          <span className="stat-value">{totalNutritionEntries}</span>
        </div>
        <div className="stat-card stat-highlight">
          <span className="stat-label">Progress Check-ins</span>
          <span className="stat-value">{totalProgressRecords}</span>
        </div>
      </div>

      <div className="content-card">
        <h3 className="card-title" style={{ marginBottom: '24px' }}>Metrics Distribution</h3>
        
        <div className="chart-bar-list" style={{ maxWidth: '600px' }}>
          <div className="chart-bar-item">
            <div className="chart-bar-info">
              <span>Goals Created</span>
              <span>{totalGoals}</span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#DCD2CE', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(totalGoals / maxVal) * 100}%`,
                  height: '100%',
                  backgroundColor: '#D6C3BC',
                  borderLeft: '4px solid #eaff42',
                  transition: 'width 0.6s ease-out'
                }}
              ></div>
            </div>
          </div>

          <div className="chart-bar-item">
            <div className="chart-bar-info">
              <span>Workouts Logged</span>
              <span>{totalWorkouts}</span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#DCD2CE', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(totalWorkouts / maxVal) * 100}%`,
                  height: '100%',
                  backgroundColor: '#D6C3BC',
                  borderLeft: '4px solid #eaff42',
                  transition: 'width 0.6s ease-out'
                }}
              ></div>
            </div>
          </div>

          <div className="chart-bar-item">
            <div className="chart-bar-info">
              <span>Nutrition Logs</span>
              <span>{totalNutritionEntries}</span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#DCD2CE', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(totalNutritionEntries / maxVal) * 100}%`,
                  height: '100%',
                  backgroundColor: '#D6C3BC',
                  borderLeft: '4px solid #eaff42',
                  transition: 'width 0.6s ease-out'
                }}
              ></div>
            </div>
          </div>

          <div className="chart-bar-item">
            <div className="chart-bar-info">
              <span>Progress Updates</span>
              <span>{totalProgressRecords}</span>
            </div>
            <div style={{ width: '100%', backgroundColor: '#DCD2CE', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${(totalProgressRecords / maxVal) * 100}%`,
                  height: '100%',
                  backgroundColor: '#D6C3BC',
                  borderLeft: '4px solid #eaff42',
                  transition: 'width 0.6s ease-out'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

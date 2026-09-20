import React, { useState, useEffect } from 'react';
import { getUserGoals, getProgressByGoal, logProgress } from '../api';
import { ProgressValueVsDateChart } from '../components/FitnessCharts';

const ProgressPage = () => {
  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [progressLogs, setProgressLogs] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [error, setError] = useState(null);

  // Form States
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [progressValue, setProgressValue] = useState('');
  const [notes, setNotes] = useState('');

  // Load goals on mount
  useEffect(() => {
    const loadGoalsData = async () => {
      try {
        setLoadingGoals(true);
        const data = await getUserGoals();
        setGoals(data || []);
        if (data && data.length > 0) {
          setSelectedGoalId(data[0].id.toString());
        }
      } catch (err) {
        setError('Failed to load goals for progress tracking');
      } finally {
        setLoadingGoals(false);
      }
    };
    loadGoalsData();
    window.addEventListener('mockDataLoaded', loadGoalsData);
    return () => window.removeEventListener('mockDataLoaded', loadGoalsData);
  }, []);

  // Load progress logs when selectedGoalId changes
  useEffect(() => {
    if (!selectedGoalId) {
      setProgressLogs([]);
      return;
    }

    const loadLogs = async () => {
      try {
        setLoadingLogs(true);
        const data = await getProgressByGoal(Number(selectedGoalId));
        setProgressLogs(data || []);
      } catch (err) {
        // Handle error or empty state
        setProgressLogs([]);
      } finally {
        setLoadingLogs(false);
      }
    };
    loadLogs();
  }, [selectedGoalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGoalId || !progressValue) {
      alert('Please select a goal and enter a progress value');
      return;
    }

    const payload = {
      fitnessGoal: { id: Number(selectedGoalId) },
      date,
      progressValue: Number(progressValue),
      notes
    };

    try {
      await logProgress(payload);
      alert('Progress logged successfully!');
      
      // Reset form
      setProgressValue('');
      setNotes('');
      setDate(new Date().toISOString().split('T')[0]);
      
      // Reload logs
      const data = await getProgressByGoal(Number(selectedGoalId));
      setProgressLogs(data || []);
    } catch (err) {
      alert('Failed to log progress');
    }
  };

  const getSelectedGoal = () => {
    return goals.find(g => g.id.toString() === selectedGoalId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="app-header">
        <h1 className="page-title">Progress Tracking</h1>
      </div>

      {loadingGoals ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : goals.length === 0 ? (
        <div className="empty-state" style={{ padding: '64px' }}>
          <svg viewBox="0 0 24 24">
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
          </svg>
          <div className="empty-title">No goals available to track</div>
          <div className="empty-subtitle">You must create a Fitness Goal before you can track progress.</div>
          <a href="/goals" className="btn btn-primary" style={{ marginTop: '24px' }}>
            Go to Goals
          </a>
        </div>
      ) : (
        <div className="dashboard-grid">
          {/* Left Column: Progress logs & Simple Charts */}
          <div>
            <div className="content-card">
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label" htmlFor="goal-select" style={{ fontSize: '15.2px' }}>Select Fitness Goal to Track:</label>
                <select
                  id="goal-select"
                  className="form-control"
                  value={selectedGoalId}
                  onChange={(e) => setSelectedGoalId(e.target.value)}
                  style={{ fontWeight: '600' }}
                >
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.goalType ? goal.goalType.replace('_', ' ') : 'General'} (Target: {goal.targetValue})
                    </option>
                  ))}
                </select>
              </div>

              {selectedGoalId && getSelectedGoal() && (
                <div style={{ display: 'flex', gap: '16px', backgroundColor: '#FAF8F7', padding: '16px', borderRadius: '6px', border: '1px solid #DCD2CE', marginBottom: '24px', fontSize: '14.4px' }}>
                  <div>
                    <strong>Type:</strong> <span style={{ textTransform: 'capitalize' }}>{getSelectedGoal().goalType.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <strong>Start Value:</strong> {getSelectedGoal().currentValue}
                  </div>
                  <div>
                    <strong>Target:</strong> {getSelectedGoal().targetValue}
                  </div>
                  <div>
                    <strong>Timeline:</strong> {getSelectedGoal().startDate} to {getSelectedGoal().targetDate}
                  </div>
                </div>
              )}

              <h3 className="card-title" style={{ marginBottom: '16px' }}>Progress History</h3>

              {loadingLogs ? (
                <div className="spinner-container">
                  <div className="spinner"></div>
                </div>
              ) : progressLogs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-title">No progress entries yet</div>
                  <div className="empty-subtitle">Log your first progress check-in on the right.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Visual Chart Bars (Value vs Date) */}
                  <ProgressValueVsDateChart logs={progressLogs} />


                  {/* Tabular logs */}
                  <div className="responsive-table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Recorded Value</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {progressLogs.map((log) => (
                          <tr key={log.id}>
                            <td style={{ fontWeight: '600' }}>{log.date}</td>
                            <td style={{ fontWeight: '700' }}>{log.progressValue}</td>
                            <td style={{ color: '#6B5E5B', fontSize: '13.6px' }}>{log.notes || 'No notes'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Progress Logger Form */}
          <div>
            <div className="content-card">
              <h3 className="card-title" style={{ marginBottom: '24px' }}>Log Progress Update</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Progress Value</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter today's measurement"
                    className="form-control"
                    value={progressValue}
                    onChange={(e) => setProgressValue(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    placeholder="Enter any notes (e.g. weight, body fat %, muscle mass...)"
                    className="form-control"
                    style={{ resize: 'vertical', minHeight: '100px' }}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Record Progress Entry
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressPage;

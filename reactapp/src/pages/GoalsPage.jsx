import React, { useState, useEffect } from 'react';
import GoalForm from '../components/GoalForm';
import { getUserGoals, updateGoal, deleteGoal } from '../api';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [editForm, setEditForm] = useState({
    goalType: '',
    targetValue: '',
    currentValue: '',
    startDate: '',
    targetDate: '',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
  });

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await getUserGoals();
      setGoals(data || []);
      setError(null);
    } catch (err) {
      setError('Unable to load goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
    window.addEventListener('mockDataLoaded', loadGoals);
    return () => window.removeEventListener('mockDataLoaded', loadGoals);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteGoal(id);
        loadGoals();
      } catch (err) {
        alert('Failed to delete goal');
      }
    }
  };

  const handleStartEdit = (goal) => {
    setEditingGoal(goal.id);
    setEditForm({
      goalType: goal.goalType,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      startDate: goal.startDate,
      targetDate: goal.targetDate,
      status: goal.status,
      priority: goal.priority,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateGoal(editingGoal, {
        id: editingGoal,
        ...editForm,
        targetValue: Number(editForm.targetValue),
        currentValue: Number(editForm.currentValue),
      });
      setEditingGoal(null);
      loadGoals();
    } catch (err) {
      alert('Failed to update goal');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'ACHIEVED':
        return 'tag-active';
      case 'IN_PROGRESS':
        return 'tag-paused';
      case 'NOT_STARTED':
      default:
        return 'tag-low';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'tag-high';
      case 'MEDIUM':
        return 'tag-medium';
      case 'LOW':
      default:
        return 'tag-low';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="app-header">
        <h1 className="page-title">Fitness Goals</h1>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Goals List */}
        <div>
          <div className="content-card">
            <h2 className="card-title" style={{ marginBottom: '24px' }}>Current Goals</h2>

            {loading ? (
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : goals.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z" />
                </svg>
                <div className="empty-title">No goals created yet</div>
                <div className="empty-subtitle">Create a fitness goal on the right to start tracking.</div>
              </div>
            ) : (
              <div className="goal-list">
                {goals.map((goal) => (
                  <div key={goal.id} className="goal-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="item-info">
                        <span className="item-title" style={{ textTransform: 'capitalize' }}>
                          {goal.goalType ? goal.goalType.replace('_', ' ') : 'General Goal'}
                        </span>
                        <span className="item-details">
                          Timeline: {goal.startDate} to {goal.targetDate}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span className={`tag ${getStatusClass(goal.status)}`}>
                          {goal.status ? goal.status.replace('_', ' ') : 'NOT STARTED'}
                        </span>
                        <span className={`tag ${getPriorityClass(goal.priority)}`}>
                          {goal.priority}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px' }}>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.6px', marginBottom: '4px' }}>
                          <span>Progress: {goal.currentValue} / {goal.targetValue}</span>
                          <span>{Math.round(goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0)}%</span>
                        </div>
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${Math.min(100, goal.targetValue > 0 ? (goal.currentValue / goal.targetValue) * 100 : 0)}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="item-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => handleStartEdit(goal)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(goal.id)}>
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Inline Edit Form */}
                    {editingGoal === goal.id && (
                      <form onSubmit={handleEditSubmit} className="content-card" style={{ marginTop: '16px', backgroundColor: '#FAF8F7', borderStyle: 'dashed' }}>
                        <h4 style={{ marginBottom: '16px', fontSize: '15.2px', fontWeight: 600 }}>Edit Goal Progress</h4>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Current Value</label>
                            <input
                              type="number"
                              className="form-control"
                              value={editForm.currentValue}
                              onChange={(e) => setEditForm({ ...editForm, currentValue: e.target.value })}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Target Value</label>
                            <input
                              type="number"
                              className="form-control"
                              value={editForm.targetValue}
                              onChange={(e) => setEditForm({ ...editForm, targetValue: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                              className="form-control"
                              value={editForm.status}
                              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                            >
                              <option value="NOT_STARTED">Not Started</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="ACHIEVED">Achieved</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Priority</label>
                            <select
                              className="form-control"
                              value={editForm.priority}
                              onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                            >
                              <option value="LOW">Low</option>
                              <option value="MEDIUM">Medium</option>
                              <option value="HIGH">High</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
                          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingGoal(null)}>
                            Cancel
                          </button>
                          <button type="submit" className="btn btn-primary btn-sm">
                            Save Changes
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Goal Creation Form */}
        <div>
          <GoalForm onGoalAdded={loadGoals} />
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;

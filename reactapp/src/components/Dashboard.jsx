import React, { useState, useEffect } from 'react';
import { fetchEntries, getRole, getMyDietPlans, getMyWorkoutPlans, completeDietPlan, completeWorkoutPlan, getUserProgressLogs } from '../api';
import { GoalBarChart, GoalDonutChart, AxisLineGraph, ProgressValueVsDateChart } from './FitnessCharts';
import ActivityLog from './ActivityLog';
import { 
  Target, 
  Dumbbell, 
  Utensils, 
  ShieldCheck, 
  Crown, 
  User,
  Calendar,
  Flame,
  Award,
  CheckCircle,
  Beef,
  Wheat,
  Droplet,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRoleState] = useState(() => getRole() || 'USER');
  const [dietPlans, setDietPlans] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [progressLogs, setProgressLogs] = useState([]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setRoleState(getRole() || 'USER');
      const data = await fetchEntries();
      setEntries(Array.isArray(data) ? data : []);

      const [dPlans, wPlans, pLogs] = await Promise.all([
        getMyDietPlans(),
        getMyWorkoutPlans(),
        getUserProgressLogs()
      ]);
      setDietPlans(dPlans || []);
      setWorkoutPlans(wPlans || []);
      setProgressLogs(pLogs || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch progress entries');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDiet = async (plan) => {
    try {
      await completeDietPlan(plan.id, plan);
      alert(`Meal routine completed! Notification sent to Nutritionist (${plan.nutritionistName || 'Staff'}).`);
      loadDashboardData();
    } catch (e) {
      alert('Failed to update meal completion status');
    }
  };

  const handleCompleteWorkout = async (plan) => {
    try {
      await completeWorkoutPlan(plan.id, plan);
      alert(`Workout routine completed! Notification sent to Trainer (${plan.trainerName || 'Staff'}).`);
      loadDashboardData();
    } catch (e) {
      alert('Failed to update workout completion status');
    }
  };

  useEffect(() => {
    loadDashboardData();
    window.addEventListener('mockDataLoaded', loadDashboardData);
    window.addEventListener('profileUpdated', loadDashboardData);
    window.addEventListener('roleUpdated', loadDashboardData);
    return () => {
      window.removeEventListener('mockDataLoaded', loadDashboardData);
      window.removeEventListener('profileUpdated', loadDashboardData);
      window.removeEventListener('roleUpdated', loadDashboardData);
    };
  }, []);

  const getDashboardHeader = () => {
    switch (role) {
      case 'TRAINER':
        return { title: 'Fitness Trainer Workspace', icon: <Dumbbell size={15} />, badgeText: 'Trainer View', subtitle: 'Monitoring client workout schedules and goal achievements' };
      case 'NUTRITIONIST':
        return { title: 'Nutritionist Control Hub', icon: <Utensils size={15} />, badgeText: 'Nutritionist View', subtitle: 'Managing diet recommendations and meal compliance' };
      case 'ADMIN':
        return { title: 'System Administrator Console', icon: <ShieldCheck size={15} />, badgeText: 'Admin View', subtitle: 'Global user metrics and application overview' };
      case 'PREMIUM_USER':
        return { title: 'Premium Fitness Dashboard', icon: <Crown size={15} color="#EAB308" />, badgeText: 'Premium View', subtitle: 'Advanced goal tracking and performance metrics' };
      default:
        return { title: 'Progress Dashboard', icon: <User size={15} />, badgeText: 'Member View', subtitle: 'Track active goals and daily fitness accomplishments' };
    }
  };

  const headerInfo = getDashboardHeader();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Workspace Header Banner */}
      <div className="content-card" style={{ marginBottom: 0 }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0px' }}>
          <div>
            <h2 className="page-title" style={{ fontSize: '20px' }}>{headerInfo.title}</h2>
            <p style={{ fontSize: '13px', color: '#6B5E5B', marginTop: '2px' }}>{headerInfo.subtitle}</p>
          </div>
          <span className="tag tag-active" style={{ fontSize: '12.8px', padding: '6px 14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {headerInfo.icon} {headerInfo.badgeText}
          </span>
        </div>
      </div>

      {/* Professional Assigned Plans (Trainer & Nutritionist) */}
      {(dietPlans.length > 0 || workoutPlans.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Assigned Diet Plan Card */}
          {dietPlans.length > 0 && (
            <div className="content-card" style={{ marginBottom: 0, borderTop: '4px solid #10B981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 className="card-title" style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Utensils size={18} color="#10B981" /> Assigned Diet Plan
                </h3>
                <span className={`tag ${dietPlans[0].status === 'COMPLETED' ? 'tag-completed' : 'tag-active'}`} style={{ fontSize: '11px', padding: '3px 8px' }}>
                  {dietPlans[0].status || 'Active'}
                </span>
              </div>
              {dietPlans.slice(0, 1).map(plan => (
                <div key={plan.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: '#1F1B1A' }}>{plan.planName}</div>
                  <div style={{ fontSize: '12.5px', color: '#6B5E5B', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Target size={13} color="#10B981" /> Goal: <strong>{plan.goal || 'Custom Nutrition'}</strong>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Flame size={13} color="#FF5500" /> Daily Target: <strong>{plan.dailyCalories || 2000} kcal</strong>
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#374151', backgroundColor: '#F3F4F6', padding: '8px 12px', borderRadius: '8px', marginTop: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Beef size={13} color="#DC2626" /> P: {plan.proteinTarget || 0}g</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Wheat size={13} color="#D97706" /> C: {plan.carbsTarget || 0}g</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Droplet size={13} color="#16A34A" /> F: {plan.fatTarget || 0}g</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={13} color="#059669" /> Assigned by Nutritionist: {plan.nutritionistName || 'Staff Nutritionist'}
                    </div>
                    {plan.status !== 'COMPLETED' && (
                      <button 
                        onClick={() => handleCompleteDiet(plan)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '11.5px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #A7F3D0' }}
                      >
                        <CheckCircle size={13} /> Mark Meal Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Assigned Workout Plan Card */}
          {workoutPlans.length > 0 && (
            <div className="content-card" style={{ marginBottom: 0, borderTop: '4px solid #3B82F6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 className="card-title" style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Dumbbell size={18} color="#3B82F6" /> Assigned Workout Plan
                </h3>
                <span className={`tag ${workoutPlans[0].status === 'COMPLETED' ? 'tag-completed' : 'tag-active'}`} style={{ fontSize: '11px', padding: '3px 8px' }}>
                  {workoutPlans[0].status || 'Active'}
                </span>
              </div>
              {workoutPlans.slice(0, 1).map(plan => (
                <div key={plan.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: '#1F1B1A' }}>{plan.name}</div>
                  <div style={{ fontSize: '12.5px', color: '#6B5E5B', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Target size={13} color="#3B82F6" /> Goal: <strong>{plan.goal || 'General Fitness'}</strong>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Dumbbell size={13} color="#3B82F6" /> Exercises: <strong>{plan.exercises ? plan.exercises.length : 0} Routines</strong>
                    </span>
                  </div>
                  {plan.description && (
                    <div style={{ fontSize: '12px', color: '#4B5563', fontStyle: 'italic' }}>"{plan.description}"</div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <div style={{ fontSize: '11.5px', color: '#2563EB', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={13} color="#2563EB" /> Assigned by Certified Trainer: {plan.trainerName || 'Fitness Trainer'}
                    </div>
                    {plan.status !== 'COMPLETED' && (
                      <button 
                        onClick={() => handleCompleteWorkout(plan)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '11.5px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#DBEAFE', color: '#1E40AF', border: '1px solid #93C5FD' }}
                      >
                        <CheckCircle size={13} /> Mark Workout Completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Active Goals & Axis Line Graph Top Grid */}
      <div className="dashboard-grid" style={{ gap: '24px', alignItems: 'stretch', width: '100%' }}>
        <div className="content-card" style={{ marginBottom: 0, height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="card-title" style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={20} color="#FF5500" /> Active Goals & Milestone Tracking
            </h3>
            <span style={{ fontSize: '12.8px', color: '#6B5E5B', fontWeight: '600' }}>{entries.length} Total Goals</span>
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

        {/* Axis Line Performance Graph */}
        <div style={{ marginBottom: 0 }}>
          <AxisLineGraph entries={entries} />
        </div>
      </div>

      {/* Progress Trend (Value vs Date) Bar Chart */}
      <ProgressValueVsDateChart logs={progressLogs} />

      {/* 3. Activity Log Component */}
      <ActivityLog entries={entries} loading={loading} error={error} />

      {/* 4. Shifted BELOW Activity Log: Goal Completion Breakdown & Goal Milestone Distribution */}
      {entries.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          <GoalBarChart entries={entries} />
          <GoalDonutChart entries={entries} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;

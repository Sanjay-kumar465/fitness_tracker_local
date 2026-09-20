import React, { useState, useEffect } from 'react';
import { getAnalyticsSummary, getRole, setRole } from '../api';
import { ProgressTrendGraph, CalorieBurnChart, MacroBreakdownChart, GoalDonutChart } from '../components/FitnessCharts';
import { Crown, Zap, Flame, Sparkles, Bot, BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';

const AnalyticsPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRoleState] = useState(() => getRole() || 'USER');

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setRoleState(getRole() || 'USER');
      const data = await getAnalyticsSummary();
      setSummary(data);
      setError(null);
    } catch (err) {
      setError('Analytics data is currently unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    window.addEventListener('mockDataLoaded', loadAnalytics);
    window.addEventListener('profileUpdated', loadAnalytics);
    window.addEventListener('roleUpdated', loadAnalytics);
    return () => {
      window.removeEventListener('mockDataLoaded', loadAnalytics);
      window.removeEventListener('profileUpdated', loadAnalytics);
      window.removeEventListener('roleUpdated', loadAnalytics);
    };
  }, []);

  const handleUpgradeToPremium = () => {
    setRole('PREMIUM_USER');
    setRoleState('PREMIUM_USER');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('profileUpdated'));
      window.dispatchEvent(new Event('roleUpdated'));
    }
  };

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
          <h1 className="page-title">Analytics & Performance</h1>
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

  const isPremiumOrPro = ['PREMIUM_USER', 'ADMIN', 'TRAINER', 'NUTRITIONIST'].includes(role);
  const { totalGoals = 0, totalWorkouts = 0, totalNutritionEntries = 0, totalProgressRecords = 0 } = summary || {};
  const maxVal = Math.max(totalGoals, totalWorkouts, totalNutritionEntries, totalProgressRecords, 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Banner */}
      <div className="app-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isPremiumOrPro ? <><Crown size={24} color="#EAB308" /> Premium Pro Analytics & Performance Insights</> : 'Standard Fitness Analytics'}
          </h1>
          <p style={{ fontSize: '14px', color: '#6B5E5B', marginTop: '4px' }}>
            {isPremiumOrPro
              ? 'Deep-dive calorie expenditure, macronutrient balance, and predictive velocity analytics.'
              : 'Overview of core fitness activity records and goal completion counts.'}
          </p>
        </div>
        <span
          className="tag"
          style={{
            backgroundColor: isPremiumOrPro ? '#FEF9E7' : '#F4F6F7',
            color: isPremiumOrPro ? '#D4AC0D' : '#34495E',
            fontSize: '13.6px',
            padding: '8px 16px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isPremiumOrPro ? <><Crown size={14} color="#D4AC0D" /> PREMIUM PRO ANALYTICS</> : 'STANDARD USER ANALYTICS'}
        </span>
      </div>

      {/* Upgrade Banner for Standard User */}
      {!isPremiumOrPro && (
        <div
          style={{
            background: 'linear-gradient(135deg, #1F1B1A 0%, #332B29 100%)',
            color: '#FFFFFF',
            padding: '24px 32px',
            borderRadius: '16px',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}
        >
          <div>
            <span className="tag" style={{ backgroundColor: '#A3E635', color: '#1F1B1A', fontWeight: '800', marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} color="#1F1B1A" /> PRO FEATURE UNLOCK
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginTop: '8px' }}>
              Unlock Advanced Premium Analytics
            </h3>
            <p style={{ fontSize: '14px', color: '#D6C3BC', marginTop: '4px', maxWidth: '600px' }}>
              Upgrade to Premium User to access Calorie Expenditure Breakdown, Macronutrient Optimization, Active Streaks, and AI Predictive Fitness Velocity.
            </p>
          </div>
          <button
            onClick={handleUpgradeToPremium}
            style={{
              backgroundColor: '#A3E635',
              color: '#1F1B1A',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '24px',
              fontWeight: '800',
              fontSize: '14.4px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(163, 230, 53, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Zap size={16} fill="#1F1B1A" /> Upgrade to Premium Now
          </button>
        </div>
      )}

      {/* Primary Metrics Grid */}
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

      {/* PREMIUM ONLY: Advanced Pro Velocity Stat Cards */}
      {isPremiumOrPro && (
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <div className="stat-card" style={{ borderLeft: '4px solid #3B82F6' }}>
            <span className="stat-label">Calorie Deficit Velocity</span>
            <span className="stat-value" style={{ color: '#3B82F6', fontSize: '24px' }}>-450 kcal/day</span>
            <span style={{ fontSize: '12px', color: '#10B981', marginTop: '4px' }}>12% faster than average</span>
          </div>
          <div className="stat-card" style={{ borderLeft: '4px solid #10B981' }}>
            <span className="stat-label">Workout Active Streak</span>
            <span className="stat-value" style={{ color: '#10B981', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              14 Days <Flame size={20} color="#FF5500" fill="#FF5500" />
            </span>
            <span style={{ fontSize: '12px', color: '#6B5E5B', marginTop: '4px' }}>Personal Best Record</span>
          </div>
          <div className="stat-card" style={{ borderLeft: '4px solid #F59E0B' }}>
            <span className="stat-label">Predicted Target Date</span>
            <span className="stat-value" style={{ color: '#F59E0B', fontSize: '22px' }}>Oct 12, 2026</span>
            <span style={{ fontSize: '12px', color: '#10B981', marginTop: '4px' }}>On track to hit milestone</span>
          </div>
          <div className="stat-card" style={{ borderLeft: '4px solid #8B5CF6' }}>
            <span className="stat-label">Training Efficiency</span>
            <span className="stat-value" style={{ color: '#8B5CF6', fontSize: '24px' }}>94% Peak</span>
            <span style={{ fontSize: '12px', color: '#6B5E5B', marginTop: '4px' }}>High Intensity Recovery</span>
          </div>
        </div>
      )}

      {/* Visual Line Trend Graph */}
      <ProgressTrendGraph />

      {/* PREMIUM ONLY: Calorie Expenditure & Macro Optimization Charts */}
      {isPremiumOrPro && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          <CalorieBurnChart />
          <MacroBreakdownChart />
        </div>
      )}

      {/* Standard Metrics Distribution */}
      <div className="content-card">
        <h3 className="card-title" style={{ marginBottom: '24px' }}>Activity Volume Distribution</h3>
        
        <div className="chart-bar-list" style={{ maxWidth: '650px' }}>
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

      {/* PREMIUM ONLY: AI Performance Intelligence Box */}
      {isPremiumOrPro && (
        <div className="content-card" style={{ backgroundColor: '#FAF8F7', borderColor: '#A3E635', borderWidth: '2px' }}>
          <h3 className="card-title" style={{ color: '#1F1B1A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={20} color="#1F1B1A" /> AI Fitness Intelligence Recommendations
          </h3>
          <ul style={{ paddingLeft: '20px', color: '#6B5E5B', fontSize: '14px', lineHeight: '1.8' }}>
            <li><strong>Optimal Workout Window:</strong> Your highest energy expenditure occurs between 07:30 AM and 09:00 AM.</li>
            <li><strong>Nutrition Adjustment:</strong> Consider increasing protein intake by 15g on Strength Training days for optimal muscle recovery.</li>
            <li><strong>Milestone Projection:</strong> Maintaining your current 14-day streak will complete your Weight Loss goal 5 days ahead of schedule!</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;

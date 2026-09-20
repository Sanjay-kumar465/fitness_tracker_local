import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getToken } from '../api';
import { Flame, ShieldCheck, Dumbbell, Utensils, Crown, User, Zap, Users } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [autofillInfo, setAutofillInfo] = useState('');

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (getToken()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleQuickAutofill = (userVal, roleLabel) => {
    setUsernameInput(userVal);
    setPassword('Password123!');
    setError('');
    setAutofillInfo(`Autofilled credentials for ${roleLabel}`);
    setTimeout(() => {
      setAutofillInfo('');
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setLoading(true);
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          setError('Invalid username or password');
        } else {
          setError('Invalid username or password. Please try using one of the quick demo buttons below.');
        }
      } else {
        setError('Backend server is currently unavailable. Please try using one of the quick demo buttons below.');
      }
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { label: 'Trainer', user: 'trainer', icon: <Dumbbell size={14} color="#2980B9" />, bg: '#EBF5FB', color: '#2980B9' },
    { label: 'Nutritionist', user: 'nutritionist', icon: <Utensils size={14} color="#117A65" />, bg: '#E8F8F5', color: '#117A65' },
    { label: 'Admin', user: 'admin', icon: <ShieldCheck size={14} color="#C0392B" />, bg: '#FDEDEC', color: '#C0392B' },
    { label: 'Premium', user: 'premiumuser', icon: <Crown size={14} color="#D4AC0D" />, bg: '#FEF9E7', color: '#D4AC0D' },
    { label: 'Standard User', user: 'standarduser', icon: <User size={14} color="#8E44AD" />, bg: '#F4ECF7', color: '#8E44AD' },
    { label: 'Alex (Partner)', user: 'alexrivera', icon: <Users size={14} color="#047857" />, bg: '#D1FAE5', color: '#047857' },
    { label: 'Sarah (Friend)', user: 'sarahrunner', icon: <Users size={14} color="#1D4ED8" />, bg: '#DBEAFE', color: '#1D4ED8' },
    { label: 'Coach Marcus', user: 'coachmarcus', icon: <Users size={14} color="#6D28D9" />, bg: '#EDE9FE', color: '#6D28D9' },
  ];

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '18px', marginBottom: '16px', color: '#1F1B1A' }}>
            <Flame size={22} color="#FF5500" fill="#FF5500" style={{ filter: 'drop-shadow(0 0 6px rgba(255, 85, 0, 0.5))' }} />
            <span>FITS — Fitness Information & Tracking System</span>
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to resume tracking your progress</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {autofillInfo && <div className="alert alert-success" style={{ fontSize: '13px', padding: '8px 12px' }}>{autofillInfo}</div>}

        {/* Quick Demo Login Credentials Selector Box */}
        <div 
          style={{ 
            marginBottom: '24px', 
            padding: '14px', 
            borderRadius: '12px', 
            backgroundColor: '#FAF8F7', 
            border: '1px solid #E5E0DC' 
          }}
        >
          <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#6B5E5B', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} color="#FF5500" fill="#FF5500" /> One-Click Role & Social Login Credentials:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {demoAccounts.map((acc) => (
              <button
                key={acc.user}
                type="button"
                onClick={() => handleQuickAutofill(acc.user, acc.label)}
                style={{
                  backgroundColor: acc.bg,
                  color: acc.color,
                  border: `1px solid ${acc.color}33`,
                  borderRadius: '20px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1.0)'; }}
              >
                {acc.icon} {acc.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '11px', color: '#8E8580', marginTop: '8px', textAlign: 'center' }}>
            Password for all accounts: <code>Password123!</code>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="e.g. alexrivera, coachmarcus, trainer"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }} className="auth-link">
            Create account
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

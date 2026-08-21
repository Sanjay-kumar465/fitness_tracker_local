import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getToken } from '../api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (getToken()) {
      navigate('/dashboard');
    }
  }, [navigate]);

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
      // Success: Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          setError('Invalid username or password');
        } else {
          setError(`Server error: ${err.response.statusText || 'Unable to connect'}`);
        }
      } else {
        setError('Backend server is currently unavailable');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '1rem', marginBottom: '1rem', color: '#1F1B1A' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#eaff42', borderRadius: '50%' }}></div>
            <span>AURA FIT</span>
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to resume tracking your progress</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
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

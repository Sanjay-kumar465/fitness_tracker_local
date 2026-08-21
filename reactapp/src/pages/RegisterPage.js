import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, getToken } from '../api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('BEGINNER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (getToken()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const validateForm = () => {
    if (username.length < 3 || username.length > 50) {
      setError('Username must be between 3 and 50 characters');
      return false;
    }
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(username)) {
      setError('Username must contain only letters and numbers');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    // Password complexity check: 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters long, containing uppercase and lowercase letters, a number, and a special character'
      );
      return false;
    }
    if (!dateOfBirth) {
      setError('Date of Birth is required');
      return false;
    }
    const dob = new Date(dateOfBirth);
    const today = new Date();
    if (dob >= today) {
      setError('Date of Birth must be in the past');
      return false;
    }
    // Age requirement check (e.g. 13 years old)
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const isUnderAge =
      age < 13 || (age === 13 && (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())));
    if (isUnderAge) {
      setError('You must be at least 13 years old to register');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await register({
        username,
        email,
        password,
        dateOfBirth,
        fitnessLevel,
      });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        // Extract backend message if present
        const backendMessage = typeof err.response.data === 'string' 
          ? err.response.data 
          : err.response.data.message || 'Registration failed';
        setError(backendMessage);
      } else {
        setError('Server is offline or unreachable');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '1rem', marginBottom: '1rem', color: '#1F1B1A' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#eaff42', borderRadius: '50%' }}></div>
            <span>AURA FIT</span>
          </div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join us to start tracking your goals</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="letters and numbers only"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8+ chars, numbers, symbols"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              className="form-control"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="fitness-level">Fitness Level</label>
            <select
              id="fitness-level"
              className="form-control"
              value={fitnessLevel}
              onChange={(e) => setFitnessLevel(e.target.value)}
              disabled={loading}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="auth-link">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../api';

const LandingPage = () => {
  const navigate = useNavigate();

  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (getToken()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="landing-container">
      {/* Landing Navbar */}
      <header className="landing-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.2rem' }}>
          <div style={{ width: '10px', height: '10px', backgroundColor: '#eaff42', borderRadius: '50%' }}></div>
          <span>AURA FIT</span>
        </div>
        <div className="landing-nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => navigate('/')}>Home</span>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/register')}>
            Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-text">
          <h1 className="hero-title">Track your goals, shape your future.</h1>
          <p className="hero-description">
            Aura Fit is a clean, minimal, and premium fitness tracker designed to help you set concrete targets, log daily activities, and monitor your physical transformation journey over time.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>
              Get Started
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <svg className="hero-svg" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background elements */}
            <circle cx="250" cy="250" r="180" fill="#D6C3BC" fillOpacity="0.4" />
            <circle cx="250" cy="250" r="140" stroke="#1F1B1A" strokeWidth="2" strokeDasharray="8 8" />
            
            {/* Running track representing goals */}
            <path d="M 120 250 A 130 130 0 0 1 380 250" stroke="#1F1B1A" strokeWidth="6" strokeLinecap="round" />
            <path d="M 380 250 A 130 130 0 0 1 120 250" stroke="#eaff42" strokeWidth="6" strokeLinecap="round" strokeDasharray="150 400" />
            
            {/* Geometric representation of runner/activity */}
            <rect x="235" y="140" width="30" height="120" rx="15" transform="rotate(25 250 200)" fill="#1F1B1A" />
            <circle cx="295" cy="120" r="18" fill="#eaff42" />
            <line x1="220" y1="230" x2="180" y2="320" stroke="#1F1B1A" strokeWidth="12" strokeLinecap="round" />
            <line x1="280" y1="230" x2="310" y2="330" stroke="#1F1B1A" strokeWidth="12" strokeLinecap="round" />
            <path d="M 230 180 L 160 210" stroke="#1F1B1A" strokeWidth="8" strokeLinecap="round" />
            <path d="M 270 190 L 320 210" stroke="#eaff42" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      {/* Features Overview */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">Core Capabilities</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/></svg>
              </div>
              <h3 className="feature-title">Fitness Goals</h3>
              <p className="feature-desc">Establish and monitor customized weight loss, weight gain, endurance, or muscle building goals.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43l-2.83-2.83-.88.88-2.68-2.68.88-.88L13.66 5 12.22 6.44l1.42 1.42-7.78 7.78-1.42-1.42L3 15.64l2.83 2.83.88-.88 2.68 2.68-.88.88L10.34 20l1.42-1.42-1.42-1.42 7.78-7.78 1.42 1.42z"/></svg>
              </div>
              <h3 className="feature-title">Workout Tracking</h3>
              <p className="feature-desc">Log exact exercises, duration, sets, repetitions, and weights completed daily.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-2h2v2zm0-4H9V7h2v6zm4 4h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </div>
              <h3 className="feature-title">Nutrition Tracking</h3>
              <p className="feature-desc">Keep record of foods, quantities, macronutrient splits, and total calories consumed.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
              </div>
              <h3 className="feature-title">Progress Insights</h3>
              <p className="feature-desc">Document historical metric updates and plot visual trends linked to active goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', fontSize: '0.85rem', color: '#6B5E5B', borderTop: '1px solid #DCD2CE' }}>
        &copy; {new Date().getFullYear()} Aura Fit. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;

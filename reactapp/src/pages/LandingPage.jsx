import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../api';
import { Flame, Target, Dumbbell, Utensils, TrendingUp, ArrowRight } from 'lucide-react';

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
      {/* Landing Top Navbar */}
      <header className="landing-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Flame size={26} color="#DC2626" fill="#DC2626" style={{ filter: 'drop-shadow(0 0 6px rgba(220, 38, 38, 0.4))' }} />
          <span style={{ fontWeight: '800', fontSize: '20px', color: 'var(--text-dark)', letterSpacing: '-0.5px' }}>FITS — Fitness Information & Tracking System</span>
        </div>
        <div className="landing-nav">
          <span className="topnav-item active" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
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
          <div className="tag tag-active" style={{ width: 'fit-content', padding: '6px 14px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={14} /> Next-Gen Fitness & Goal Tracking
          </div>
          <h1 className="hero-title">Track your goals, shape your future.</h1>
          <p className="hero-description">
            Ignite Fit is a clean, minimal, and premium fitness tracker designed to help you set concrete targets, log daily workout activities, and monitor your physical transformation over time.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '15px' }} onClick={() => navigate('/register')}>
              Get Started Free <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '15px' }} onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <svg className="hero-svg" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background glowing circles */}
            <circle cx="250" cy="250" r="200" fill="#FEF2F2" opacity="0.8" />
            <circle cx="250" cy="250" r="150" stroke="#FCA5A5" strokeWidth="2" strokeDasharray="8 8" />
            <circle cx="250" cy="250" r="100" stroke="#DC2626" strokeWidth="1" opacity="0.3" />
            
            {/* Running arc track representing goal progress */}
            <path d="M 100 250 A 150 150 0 0 1 400 250" stroke="#CBD5E1" strokeWidth="12" strokeLinecap="round" />
            <path d="M 400 250 A 150 150 0 0 1 130 290" stroke="#DC2626" strokeWidth="12" strokeLinecap="round" strokeDasharray="220 500" />
            
            {/* Dynamic runner silhouette */}
            <rect x="235" y="130" width="32" height="120" rx="16" transform="rotate(25 250 190)" fill="#0F172A" />
            <circle cx="300" cy="115" r="20" fill="#DC2626" />
            <line x1="220" y1="240" x2="170" y2="340" stroke="#0F172A" strokeWidth="14" strokeLinecap="round" />
            <line x1="285" y1="240" x2="320" y2="350" stroke="#0F172A" strokeWidth="14" strokeLinecap="round" />
            <path d="M 235 180 L 160 215" stroke="#0F172A" strokeWidth="10" strokeLinecap="round" />
            <path d="M 275 195 L 335 215" stroke="#DC2626" strokeWidth="10" strokeLinecap="round" />
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
                <Target size={32} color="#DC2626" />
              </div>
              <h3 className="feature-title">Fitness Goals</h3>
              <p className="feature-desc">Establish and monitor customized weight loss, weight gain, endurance, or muscle building goals.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Dumbbell size={32} color="#DC2626" />
              </div>
              <h3 className="feature-title">Workout Tracking</h3>
              <p className="feature-desc">Log exact exercises, duration, sets, repetitions, and weights completed daily.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Utensils size={32} color="#DC2626" />
              </div>
              <h3 className="feature-title">Nutrition Tracking</h3>
              <p className="feature-desc">Keep record of foods, quantities, macronutrient splits, and total calories consumed.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={32} color="#DC2626" />
              </div>
              <h3 className="feature-title">Progress Insights</h3>
              <p className="feature-desc">Document historical metric updates and plot visual trends linked to active goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px', textAlign: 'center', fontSize: '13.5px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
        &copy; {new Date().getFullYear()} Ignite Fit. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;

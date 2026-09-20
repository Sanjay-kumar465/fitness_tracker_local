import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUsername, getRole, logout, toggleMockData, isMockDataActive, upgradeToPremium } from '../api';
import {
  Flame,
  Database,
  LayoutDashboard,
  Target,
  Dumbbell,
  Utensils,
  TrendingUp,
  Bell,
  Users,
  User,
  BarChart3,
  ShieldCheck,
  Crown,
  Zap,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mock data state
  const [mockActive, setMockActive] = useState(() => isMockDataActive());
  const [username, setUsernameState] = useState(() => getUsername() || 'User');
  const [role, setRoleState] = useState(() => getRole() || 'USER');

  // Light / Dark Theme State (persisted in localStorage)
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  useEffect(() => {
    const syncContext = () => {
      setUsernameState(getUsername() || 'User');
      setRoleState(getRole() || 'USER');
      setMockActive(isMockDataActive());
    };

    window.addEventListener('profileUpdated', syncContext);
    window.addEventListener('roleUpdated', syncContext);
    window.addEventListener('mockDataLoaded', syncContext);
    return () => {
      window.removeEventListener('profileUpdated', syncContext);
      window.removeEventListener('roleUpdated', syncContext);
      window.removeEventListener('mockDataLoaded', syncContext);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleToggleMockData = () => {
    const active = toggleMockData();
    setMockActive(active);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const isActive = (path) => location.pathname === path;

  const isTrainer = role === 'TRAINER';
  const isNutritionist = role === 'NUTRITIONIST';
  const isAdmin = role === 'ADMIN';
  const isNormalUser = role === 'USER' || role === 'STANDARD_USER';

  return (
    <div className="app-container">
      {/* Floating Liquid Glass Capsule Island Navbar */}
      <header className="topnav">
        {/* Left Section: Brand Logo + Vertical Separator Divider */}
        <div className="topnav-left">
          <div className="topnav-logo" onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <Flame size={24} color="#DC2626" fill="#DC2626" style={{ filter: 'drop-shadow(0 0 6px rgba(220, 38, 38, 0.4))' }} />
            <span className="logo-text" style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>FITS — Fitness Information & Tracking System</span>
          </div>
          <div className="topnav-divider" />
        </div>

        {/* Center Section: Navigation Text Links */}
        <nav className="topnav-links">
          <a
            href="/dashboard"
            onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
            className={`topnav-item ${isActive('/dashboard') ? 'active' : ''}`}
          >
            Dashboard
          </a>

          <a
            href="/goals"
            onClick={(e) => { e.preventDefault(); navigate('/goals'); }}
            className={`topnav-item ${isActive('/goals') ? 'active' : ''}`}
          >
            {isTrainer ? 'Client Goals' : isNutritionist ? 'Nutritional Goals' : 'Goals'}
          </a>

          {!isNutritionist && (
            <a
              href="/workouts"
              onClick={(e) => { e.preventDefault(); navigate('/workouts'); }}
              className={`topnav-item ${isActive('/workouts') ? 'active' : ''}`}
            >
              {isTrainer ? 'Client Workouts' : 'Workouts'}
            </a>
          )}

          {!isTrainer && (
            <a
              href="/nutrition"
              onClick={(e) => { e.preventDefault(); navigate('/nutrition'); }}
              className={`topnav-item ${isActive('/nutrition') ? 'active' : ''}`}
            >
              {isNutritionist ? 'Diet Plans' : 'Nutrition'}
            </a>
          )}

          <a
            href="/progress"
            onClick={(e) => { e.preventDefault(); navigate('/progress'); }}
            className={`topnav-item ${isActive('/progress') ? 'active' : ''}`}
          >
            Progress
          </a>

          <a
            href="/notifications"
            onClick={(e) => { e.preventDefault(); navigate('/notifications'); }}
            className={`topnav-item ${isActive('/notifications') ? 'active' : ''}`}
          >
            Notifications
          </a>

          <a
            href="/social"
            onClick={(e) => { e.preventDefault(); navigate('/social'); }}
            className={`topnav-item ${isActive('/social') ? 'active' : ''}`}
          >
            {isTrainer || isNutritionist ? 'Clients & Social' : 'Social'}
          </a>

          <a
            href="/profile"
            onClick={(e) => { e.preventDefault(); navigate('/profile'); }}
            className={`topnav-item ${isActive('/profile') ? 'active' : ''}`}
          >
            Profile
          </a>

          {!isTrainer && !isNutritionist && (isAdmin || role === 'PREMIUM_USER') && (
            <a
              href="/analytics"
              onClick={(e) => { e.preventDefault(); navigate('/analytics'); }}
              className={`topnav-item ${isActive('/analytics') ? 'active' : ''}`}
            >
              Analytics
            </a>
          )}

          {isAdmin && (
            <a
              href="/admin/users"
              onClick={(e) => { e.preventDefault(); navigate('/admin/users'); }}
              className={`topnav-item ${isActive('/admin/users') ? 'active' : ''}`}
            >
              User Management
            </a>
          )}
        </nav>

        {/* Right Section: Toggles & Action Pill Button */}
        <div className="topnav-actions">
          {/* Upgrade to Premium Button for Normal User */}
          {isNormalUser && (
            <button
              id="btn-upgrade-to-premium-sidebar"
              onClick={async () => {
                await upgradeToPremium();
              }}
              style={{
                padding: '6px 14px',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                color: '#DC2626',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                borderRadius: '30px',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DC2626';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
                e.currentTarget.style.color = '#DC2626';
              }}
            >
              <Crown size={14} color="#EAB308" fill="#EAB308" /> Upgrade
            </button>
          )}

          {/* 1. SEPARATE LIGHT & DARK MODE THEME TOGGLE */}
          <div
            onClick={toggleTheme}
            title={theme === 'light' ? "Switch to Dark Theme" : "Switch to Light Theme"}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              backgroundColor: theme === 'dark' ? '#334155' : '#E2E8F0',
              padding: '3px',
              borderRadius: '25px',
              border: '1px solid var(--border-color)',
              width: '54px',
              height: '28px',
              position: 'relative',
              transition: 'background-color 0.25s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 4px' }}>
              <Sun size={13} color={theme === 'light' ? '#F59E0B' : '#64748B'} />
              <Moon size={13} color={theme === 'dark' ? '#38BDF8' : '#94A3B8'} />
            </div>
            <div
              style={{
                width: '22px',
                height: '22px',
                backgroundColor: theme === 'dark' ? '#0F172A' : '#FFFFFF',
                borderRadius: '50%',
                position: 'absolute',
                top: '2px',
                left: theme === 'dark' ? '28px' : '2px',
                transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}
            >
              {theme === 'light' ? <Sun size={12} color="#F59E0B" /> : <Moon size={12} color="#38BDF8" />}
            </div>
          </div>

          {/* 2. SEPARATE NAMELESS MOCK DATA SWITCH TOGGLE */}
          <div
            id="btn-load-mock-data"
            onClick={handleToggleMockData}
            title={mockActive ? "Mock Data Active (Click to Revert)" : "Enable Sample Mock Data"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              backgroundColor: mockActive ? 'rgba(220, 38, 38, 0.1)' : 'var(--card-bg)',
              padding: '5px 10px',
              borderRadius: '25px',
              border: mockActive ? '1px solid #DC2626' : '1px solid var(--border-color)',
              transition: 'all 0.25s ease'
            }}
          >
            <Database size={15} color={mockActive ? '#DC2626' : 'var(--text-muted)'} />
            <div
              style={{
                width: '32px',
                height: '18px',
                backgroundColor: mockActive ? '#DC2626' : '#CBD5E1',
                borderRadius: '9px',
                position: 'relative',
                transition: 'background-color 0.25s ease'
              }}
            >
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: mockActive ? '16px' : '2px',
                  transition: 'left 0.25s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}
              />
            </div>
          </div>

          {/* User Status Pill */}
          <div className="user-pill">
            <span className="user-pill-name">{username}</span>
            <span className="user-pill-role">
              {role === 'ADMIN' ? 'Admin' :
               role === 'TRAINER' ? 'Trainer' :
               role === 'NUTRITIONIST' ? 'Nutritionist' :
               role === 'PREMIUM_USER' ? 'Premium' : role}
            </span>
          </div>

          {/* Action Pill Button matching Get Started capsule */}
          <button className="topnav-logout-btn" onClick={handleLogout} title="Sign Out">
            Logout <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

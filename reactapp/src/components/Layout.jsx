import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUsername, getRole, logout } from '../api';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const username = getUsername() || 'User';
  const role = getRole() || 'USER';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Custom Inline SVGs
  const dashboardIcon = (
    <svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
  );
  const goalsIcon = (
    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.53c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
  );
  const workoutsIcon = (
    <svg viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43l-2.83-2.83-.88.88-2.68-2.68.88-.88L13.66 5 12.22 6.44l1.42 1.42-7.78 7.78-1.42-1.42L3 15.64l2.83 2.83.88-.88 2.68 2.68-.88.88L10.34 20l1.42-1.42-1.42-1.42 7.78-7.78 1.42 1.42z"/></svg>
  );
  const nutritionIcon = (
    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-2h2v2zm0-4H9V7h2v6zm4 4h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
  );
  const progressIcon = (
    <svg viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
  );
  const notificationsIcon = (
    <svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
  );
  const socialIcon = (
    <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 1.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.83 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
  );
  const analyticsIcon = (
    <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
  );
  const adminIcon = (
    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/></svg>
  );
  const profileIcon = (
    <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
  );

  return (
    <div className="app-container">
      {/* Mobile Header Toggle */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: '#1F1B1A',
          color: '#FFFFFF',
          padding: '0 24px',
          zIndex: 110,
          borderBottom: '1px solid #332B29',
        }}
        className="mobile-nav-toggle"
      >
        <span style={{ fontWeight: '700', fontSize: '19.2px' }}>AURA FIT</span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
        >
          <svg style={{ width: '28px', height: '28px', fill: 'currentColor' }} viewBox="0 0 24 24">
            <path d={sidebarOpen ? "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" : "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"} />
          </svg>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo-section">
          <div className="logo-dot"></div>
          <span>AURA FIT</span>
        </div>

        <nav className="nav-links">
          <a
            href="/dashboard"
            onClick={(e) => { e.preventDefault(); navigate('/dashboard'); setSidebarOpen(false); }}
            className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
          >
            {dashboardIcon} Dashboard
          </a>
          <a
            href="/goals"
            onClick={(e) => { e.preventDefault(); navigate('/goals'); setSidebarOpen(false); }}
            className={`nav-item ${isActive('/goals') ? 'active' : ''}`}
          >
            {goalsIcon} Goals
          </a>
          <a
            href="/workouts"
            onClick={(e) => { e.preventDefault(); navigate('/workouts'); setSidebarOpen(false); }}
            className={`nav-item ${isActive('/workouts') ? 'active' : ''}`}
          >
            {workoutsIcon} Workouts
          </a>
          <a
            href="/nutrition"
            onClick={(e) => { e.preventDefault(); navigate('/nutrition'); setSidebarOpen(false); }}
            className={`nav-item ${isActive('/nutrition') ? 'active' : ''}`}
          >
            {nutritionIcon} Nutrition
          </a>
          <a
            href="/progress"
            onClick={(e) => { e.preventDefault(); navigate('/progress'); setSidebarOpen(false); }}
            className={`nav-item ${isActive('/progress') ? 'active' : ''}`}
          >
            {progressIcon} Progress
          </a>
          <a
            href="/notifications"
            onClick={(e) => { e.preventDefault(); navigate('/notifications'); setSidebarOpen(false); }}
            className={`nav-item ${isActive('/notifications') ? 'active' : ''}`}
          >
            {notificationsIcon} Notifications
          </a>
          <a
            href="/social"
            onClick={(e) => { e.preventDefault(); navigate('/social'); setSidebarOpen(false); }}
            className={`nav-item ${isActive('/social') ? 'active' : ''}`}
          >
            {socialIcon} Social
          </a>
          <a
            href="/profile"
            onClick={(e) => { e.preventDefault(); navigate('/profile'); setSidebarOpen(false); }}
            className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
          >
            {profileIcon} Profile
          </a>

          {/* Premium / Admin Route */}
          {(role === 'PREMIUM_USER' || role === 'ADMIN') && (
            <a
              href="/analytics"
              onClick={(e) => { e.preventDefault(); navigate('/analytics'); setSidebarOpen(false); }}
              className={`nav-item ${isActive('/analytics') ? 'active' : ''}`}
            >
              {analyticsIcon} Analytics
            </a>
          )}

          {/* Admin Only Route */}
          {role === 'ADMIN' && (
            <a
              href="/admin/users"
              onClick={(e) => { e.preventDefault(); navigate('/admin/users'); setSidebarOpen(false); }}
              className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}
            >
              {adminIcon} User Management
            </a>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-name">{username}</div>
            <div className="user-role">{role}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

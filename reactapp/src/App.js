import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import Dashboard from './components/Dashboard';
import ActivityLog from './components/ActivityLog';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GoalsPage from './pages/GoalsPage';
import WorkoutsPage from './pages/WorkoutsPage';
import NutritionPage from './pages/NutritionPage';
import ProgressPage from './pages/ProgressPage';
import NotificationsPage from './pages/NotificationsPage';
import SocialPage from './pages/SocialPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div className="app-header">
                    <h1 className="page-title">Dashboard</h1>
                  </div>
                  <div className="dashboard-grid">
                    <Dashboard />
                    <ActivityLog />
                  </div>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Core CRUD Routes */}
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <Layout>
                <GoalsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/workouts"
          element={
            <ProtectedRoute>
              <Layout>
                <WorkoutsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/nutrition"
          element={
            <ProtectedRoute>
              <Layout>
                <NutritionPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Layout>
                <ProgressPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Secondary Routes */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <NotificationsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/social"
          element={
            <ProtectedRoute>
              <Layout>
                <SocialPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Premium Advanced Analytics */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['PREMIUM_USER', 'ADMIN']}>
                <Layout>
                  <AnalyticsPage />
                </Layout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin User Management */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['ADMIN']}>
                <Layout>
                  <AdminPage />
                </Layout>
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

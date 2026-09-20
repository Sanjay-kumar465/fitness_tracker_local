import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, getRole, setRole, getUsername, setUsername, upgradeToPremium, deleteUserAccount, getUserId } from '../api';
import { 
  Crown, 
  Zap, 
  User, 
  Dumbbell, 
  Utensils, 
  ShieldCheck, 
  Trash2, 
  Key, 
  Activity, 
  Flame, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // Editable Profile & Account States
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState('USER');
  const [height, setHeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [healthConditions, setHealthConditions] = useState('');
  const [deleting, setDeleting] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setProfile(data);
      if (data) {
        setUsernameInput(data.user?.username || data.username || getUsername() || 'User');
        setEmailInput(data.user?.email || data.email || 'user@example.com');
        setRoleInput(data.role || getRole() || 'USER');
        setHeight(data.height || '');
        setCurrentWeight(data.currentWeight || data.weight || '');
        setTargetWeight(data.targetWeight || '');
        setActivityLevel(data.activityLevel || '');
        setHealthConditions(data.healthConditions || data.bio || '');
      }
    } catch (err) {
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    window.addEventListener('mockDataLoaded', loadProfile);
    window.addEventListener('profileUpdated', loadProfile);
    return () => {
      window.removeEventListener('mockDataLoaded', loadProfile);
      window.removeEventListener('profileUpdated', loadProfile);
    };
  }, []);

  const handleUpgradeNow = async () => {
    await upgradeToPremium();
    setRoleInput('PREMIUM_USER');
    setSuccess('Congratulations! You have successfully upgraded to PREMIUM_USER! Premium Pro Analytics are now active.');
    setTimeout(() => {
      setSuccess('');
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const newRole = roleInput.toUpperCase();
    const newUsername = usernameInput.trim() || 'User';

    const payload = {
      username: newUsername,
      email: emailInput.trim(),
      role: newRole,
      height: height ? Number(height) : null,
      currentWeight: currentWeight ? Number(currentWeight) : null,
      targetWeight: targetWeight ? Number(targetWeight) : null,
      activityLevel,
      healthConditions
    };

    try {
      const updated = await updateUserProfile(payload);
      setRole(newRole);
      setUsername(newUsername);
      setSuccess(`Profile & Account Role updated to ${newRole}! Changes are now reflected across all pages.`);
      setProfile(updated);
      setTimeout(() => {
        setSuccess('');
      }, 4000);
    } catch (err) {
      setError('Failed to update profile settings');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.")) {
      try {
        setDeleting(true);
        await deleteUserAccount(getUserId());
      } catch (e) {
        setError('Failed to delete account');
        setDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const roleColorMap = {
    ADMIN: { bg: '#FDEDEC', color: '#C0392B', text: 'ADMIN CONTROL' },
    TRAINER: { bg: '#EBF5FB', color: '#2980B9', text: 'CERTIFIED TRAINER' },
    NUTRITIONIST: { bg: '#E8F8F5', color: '#117A65', text: 'NUTRITION SPECIALIST' },
    PREMIUM_USER: { bg: '#FEF9E7', color: '#D4AC0D', text: 'PREMIUM MEMBER' },
    STANDARD_USER: { bg: '#F4ECF7', color: '#8E44AD', text: 'STANDARD MEMBER' },
    USER: { bg: '#F4F6F7', color: '#34495E', text: 'USER' }
  };

  const badgeInfo = roleColorMap[roleInput] || roleColorMap.USER;
  const isNormalUser = roleInput === 'USER' || roleInput === 'STANDARD_USER';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '850px', margin: '0 auto', width: '100%' }}>
      <div className="app-header">
        <div>
          <h1 className="page-title">Profile & Account Settings</h1>
          <p style={{ fontSize: '14px', color: '#6B5E5B', marginTop: '4px' }}>
            Update your account credentials, role (User/Trainer/Nutritionist/Admin), and fitness preferences.
          </p>
        </div>
        <span
          className="tag"
          style={{
            backgroundColor: badgeInfo.bg,
            color: badgeInfo.color,
            fontSize: '13.6px',
            padding: '8px 16px',
            fontWeight: '700'
          }}
        >
          {badgeInfo.text}
        </span>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} /> {success}</div>}

      {/* Upgrade to Premium Card - STRICTLY for normal users only */}
      {isNormalUser && (
        <div
          className="content-card"
          style={{
            background: 'linear-gradient(135deg, #064E3B 0%, #047857 100%)',
            color: '#FFFFFF',
            border: 'none',
            boxShadow: '0 8px 24px rgba(6, 78, 59, 0.3)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="tag" style={{ backgroundColor: '#A3E635', color: '#1F1B1A', fontWeight: '800', marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Crown size={14} color="#1F1B1A" /> PRO MEMBERSHIP UNLOCK
              </span>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px' }}>Upgrade to Premium Account</h3>
              <p style={{ fontSize: '13.6px', opacity: 0.9, marginTop: '4px', maxWidth: '550px' }}>
                Unlock Calorie Expenditure breakdowns, Macronutrient optimization, active workout streaks, and predictive fitness velocity graphs.
              </p>
            </div>
            <button
              id="btn-upgrade-profile"
              onClick={handleUpgradeNow}
              style={{
                padding: '12px 24px',
                backgroundColor: '#eaff42',
                color: '#1F1B1A',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '14.4px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Upgrade Now <Zap size={16} fill="#1F1B1A" />
            </button>
          </div>
        </div>
      )}

      <div className="content-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', borderBottom: '1px solid #DCD2CE', paddingBottom: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#D6C3BC', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '26px', fontWeight: 700, color: '#1F1B1A' }}>
            {usernameInput ? usernameInput.substring(0, 2).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700 }}>{usernameInput || 'User'}</h3>
            <p style={{ fontSize: '14px', color: '#6B5E5B' }}>{emailInput || 'user@example.com'}</p>
            <span style={{ fontSize: '12.8px', color: badgeInfo.color, fontWeight: '600' }}>
              Active Role: {roleInput}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#1F1B1A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={18} color="#FF5500" /> Account Identity & Role Assignment
            </h4>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '700', color: '#1F1B1A' }}>
                  Account Role (Switches view mode instantly)
                </label>
                <select
                  className="form-control"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  style={{ fontWeight: '600', borderColor: badgeInfo.color }}
                >
                  <option value="USER">User (Standard Member)</option>
                  <option value="STANDARD_USER">Standard User</option>
                  <option value="PREMIUM_USER">Premium User</option>
                  <option value="TRAINER">Fitness Trainer</option>
                  <option value="NUTRITIONIST">Nutritionist</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>
            </div>
          </div>

          <hr style={{ margin: '24px 0', borderColor: '#DCD2CE' }} />

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#1F1B1A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="#FF5500" /> Physical Stats & Health Preferences
            </h4>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Height (cm/inches)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 175"
                  className="form-control"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Activity Level</label>
                <select
                  className="form-control"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                >
                  <option value="">Select Activity Level</option>
                  <option value="Sedentary">Sedentary (Little/no exercise)</option>
                  <option value="Light">Lightly Active (1-3 days/week)</option>
                  <option value="Moderate">Moderately Active (3-5 days/week)</option>
                  <option value="Active">Very Active (6-7 days/week)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Current Weight (kg/lbs)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 70"
                  className="form-control"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Weight (kg/lbs)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 65"
                  className="form-control"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label">Health Conditions & Dietary Notes</label>
              <textarea
                placeholder="e.g. Asthma, High Blood Pressure, Gluten Intolerance..."
                className="form-control"
                style={{ resize: 'vertical', minHeight: '90px' }}
                value={healthConditions}
                onChange={(e) => setHealthConditions(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px', fontWeight: '700' }}>
            Save Changes & Refresh Views
          </button>
        </form>
      </div>

      {/* Danger Zone: Delete Account Feature */}
      <div 
        className="content-card"
        style={{
          border: '1px solid #FCA5A5',
          backgroundColor: '#FEF2F2',
          marginTop: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="#DC2626" /> Danger Zone: Delete Account
            </h4>
            <p style={{ fontSize: '13.6px', color: '#7F1D1D', marginTop: '4px', maxWidth: '550px' }}>
              Permanently delete your FITS — Fitness Information & Tracking System user account, goals, progress logs, and social connections. This action cannot be undone.
            </p>
          </div>
          <button
            id="btn-delete-account"
            onClick={handleDeleteAccount}
            disabled={deleting}
            style={{
              padding: '10px 20px',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '13.6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
            }}
          >
            <Trash2 size={16} /> {deleting ? 'Deleting Account...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

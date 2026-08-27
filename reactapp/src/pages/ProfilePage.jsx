import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // Editable Form States
  const [height, setHeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [healthConditions, setHealthConditions] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setProfile(data);
        if (data) {
          setHeight(data.height || '');
          setCurrentWeight(data.currentWeight || '');
          setTargetWeight(data.targetWeight || '');
          setActivityLevel(data.activityLevel || '');
          setHealthConditions(data.healthConditions || '');
        }
      } catch (err) {
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      height: height ? Number(height) : null,
      currentWeight: currentWeight ? Number(currentWeight) : null,
      targetWeight: targetWeight ? Number(targetWeight) : null,
      activityLevel,
      healthConditions
    };

    try {
      const updated = await updateUserProfile(payload);
      setSuccess('Profile updated successfully!');
      setProfile(updated);
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div className="app-header">
        <h1 className="page-title">User Profile</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="content-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', borderBottom: '1px solid #DCD2CE', paddingBottom: '24px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#D6C3BC', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', fontSize: '24px', fontWeight: 700, color: '#1F1B1A' }}>
            {profile?.user?.username ? profile.user.username.substring(0, 2).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 style={{ fontSize: '19.2px', fontWeight: 700 }}>{profile?.user?.username || 'User'}</h3>
            <p style={{ fontSize: '13.6px', color: '#6B5E5B' }}>{profile?.user?.email || 'email@example.com'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Height (inches or cm)</label>
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
            <label className="form-label">Health Conditions</label>
            <textarea
              placeholder="e.g. Asthma, High Blood Pressure, Gluten Intolerance..."
              className="form-control"
              style={{ resize: 'vertical', minHeight: '100px' }}
              value={healthConditions}
              onChange={(e) => setHealthConditions(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px' }}>
            Save Profile Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

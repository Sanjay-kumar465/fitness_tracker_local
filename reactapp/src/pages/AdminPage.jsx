import React, { useState, useEffect } from 'react';
import { getUserById, updateUserRole, getUserId } from '../api';
import { ShieldCheck } from 'lucide-react';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');

  const currentUserId = Number(getUserId()) || 1;

  const scanUsers = async () => {
    try {
      setLoading(true);
      const resolvedUsers = [];
      // Scan the first 20 potential sequential user IDs
      for (let id = 1; id <= 20; id++) {
        try {
          const user = await getUserById(id);
          if (user && user.id) {
            resolvedUsers.push(user);
          }
        } catch (e) {
          // User ID doesn't exist, skip
        }
      }
      setUsers(resolvedUsers);
      setError(null);
    } catch (err) {
      setError('Failed to scan database users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scanUsers();
    window.addEventListener('profileUpdated', scanUsers);
    return () => window.removeEventListener('profileUpdated', scanUsers);
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setStatusMsg(`User #${userId} role updated to ${newRole}! Changes are now reflected on the user's view.`);
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      setError(`Failed to update role for user #${userId}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="app-header">
        <div>
          <h1 className="page-title">Admin Console & User Management</h1>
          <p style={{ fontSize: '14px', color: '#6B5E5B', marginTop: '4px' }}>
            Manage user roles across Standard Users, Trainers, Nutritionists, Premium Users, and Admins.
          </p>
        </div>
        <span className="tag tag-cancelled" style={{ fontSize: '12.8px', padding: '6.4px 12.8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} /> Admin Access
        </span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Active Users</span>
          <span className="stat-value">{users.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Database Status</span>
          <span className="stat-value" style={{ fontSize: '24px', color: '#27AE60' }}>ONLINE</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">System Role Engine</span>
          <span className="stat-value" style={{ fontSize: '19.2px', color: '#8E44AD' }}>DYNAMIC</span>
        </div>
      </div>

      {statusMsg && <div className="alert alert-success">{statusMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="content-card">
        <h3 className="card-title" style={{ marginBottom: '24px' }}>User Role Management</h3>

        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">No users found in scanner</div>
            <div className="empty-subtitle">Database might be empty or restricted.</div>
          </div>
        ) : (
          <div className="responsive-table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Assign Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td style={{ fontWeight: '600' }}>
                      {user.username} {user.id === currentUserId ? '(You)' : ''}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`tag ${
                        user.role === 'ADMIN' ? 'tag-cancelled' :
                        user.role === 'TRAINER' ? 'tag-active' :
                        user.role === 'NUTRITIONIST' ? 'tag-low' :
                        user.role === 'PREMIUM_USER' ? 'tag-active' : 'tag-low'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        value={user.role || 'USER'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        style={{ padding: '4px 8px', fontSize: '13px', fontWeight: '600' }}
                      >
                        <option value="USER">USER</option>
                        <option value="STANDARD_USER">STANDARD_USER</option>
                        <option value="PREMIUM_USER">PREMIUM_USER</option>
                        <option value="TRAINER">TRAINER</option>
                        <option value="NUTRITIONIST">NUTRITIONIST</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td>
                      <span className="tag tag-active" style={{ backgroundColor: '#E8F8F5', color: '#117A65' }}>Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;


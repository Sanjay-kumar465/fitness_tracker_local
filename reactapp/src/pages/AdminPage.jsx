import React, { useState, useEffect } from 'react';
import { getUserById } from '../api';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    scanUsers();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="app-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <span className="tag tag-cancelled" style={{ fontSize: '12.8px', padding: '6.4px 12.8px' }}>Admin Role</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Scanned Users</span>
          <span className="stat-value">{users.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Database Status</span>
          <span className="stat-value" style={{ fontSize: '24px', color: '#27AE60' }}>ONLINE</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">CORS Context</span>
          <span className="stat-value" style={{ fontSize: '19.2px' }}>8080 - 8081</span>
        </div>
      </div>

      <div className="content-card">
        <h3 className="card-title" style={{ marginBottom: '24px' }}>User Management</h3>

        {error && <div className="alert alert-danger">{error}</div>}

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
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td style={{ fontWeight: '600' }}>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`tag ${user.role === 'ADMIN' ? 'tag-cancelled' : user.role === 'PREMIUM_USER' ? 'tag-active' : 'tag-low'}`}>
                        {user.role}
                      </span>
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

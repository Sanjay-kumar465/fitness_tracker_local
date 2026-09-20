import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getRole, getToken } from '../api';

const RoleRoute = ({ children, allowedRoles }) => {
  const token = getToken();
  const [userRole, setUserRole] = useState(() => getRole() || 'USER');

  useEffect(() => {
    const handleRoleUpdate = () => {
      setUserRole(getRole() || 'USER');
    };
    window.addEventListener('profileUpdated', handleRoleUpdate);
    window.addEventListener('roleUpdated', handleRoleUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleRoleUpdate);
      window.removeEventListener('roleUpdated', handleRoleUpdate);
    };
  }, []);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Map roles to accommodate both Spring standard outputs and SRS names
  const normalizedUserRole = userRole ? userRole.toUpperCase() : 'USER';
  const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase());

  // Check if role is allowed
  const hasAccess = normalizedAllowedRoles.includes(normalizedUserRole) || normalizedUserRole === 'ADMIN';

  if (!hasAccess) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <h2 style={{ color: '#C0392B', marginBottom: '16px' }}>Access Denied</h2>
        <p>You do not have the required permissions for role: {normalizedUserRole}.</p>
        <a href="/profile" className="btn btn-primary" style={{ marginTop: '24px' }}>
          Go to Profile & Switch Role
        </a>
      </div>
    );
  }

  return children;
};

export default RoleRoute;

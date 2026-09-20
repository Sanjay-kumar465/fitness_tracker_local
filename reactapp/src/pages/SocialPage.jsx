import React, { useState, useEffect } from 'react';
import { getUserConnections, sendConnectionRequestByUsername, sendConnectionRequest, acceptConnectionRequest, getUserId, getUsername } from '../api';
import { UserPlus } from 'lucide-react';

const SocialPage = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search / Add States
  const [friendUsernameInput, setFriendUsernameInput] = useState('');
  const [connectionType, setConnectionType] = useState('FRIEND');
  const [submitting, setSubmitting] = useState(false);

  const currentUserId = Number(getUserId()) || 1;
  const currentUsername = getUsername() || 'sanjaykumar465';

  const loadConnections = async () => {
    try {
      setLoading(true);
      const data = await getUserConnections();
      setConnections(data || []);
      setError(null);
    } catch (err) {
      setError('Unable to load social connections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConnections();
    window.addEventListener('mockDataLoaded', loadConnections);
    return () => window.removeEventListener('mockDataLoaded', loadConnections);
  }, []);

  // Add Friend by DB Username
  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!friendUsernameInput.trim()) {
      alert('Please enter a Friend Username');
      return;
    }

    const inputUsername = friendUsernameInput.trim();
    if (inputUsername === currentUsername) {
      alert('You cannot send a connection request to yourself');
      return;
    }

    try {
      setSubmitting(true);
      const isNum = !isNaN(Number(inputUsername));
      
      let res;
      if (isNum) {
        res = await sendConnectionRequest(Number(inputUsername), connectionType);
      } else {
        res = await sendConnectionRequestByUsername(inputUsername, connectionType);
      }

      alert(`Connection request sent to ${inputUsername}!`);
      setFriendUsernameInput('');
      await loadConnections();
    } catch (err) {
      alert(`Failed to send connection request. Ensure '${inputUsername}' is registered in database.`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptRequest = async (connectionId) => {
    try {
      await acceptConnectionRequest(connectionId);
      alert('Request accepted!');
      loadConnections();
    } catch (err) {
      alert('Failed to accept request');
    }
  };

  // Filter connections:
  const friends = connections.filter(c => c.status === 'ACCEPTED');
  
  const incomingRequests = connections.filter(
    c => c.status === 'PENDING' && c.friend && c.friend.id === currentUserId
  );

  const outgoingRequests = connections.filter(
    c => (c.status === 'PENDING' && c.user && c.user.id === currentUserId) ||
         (c.status === 'PENDING' && c.user?.username === currentUsername)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="app-header">
        <h1 className="page-title">Social Connections</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="dashboard-grid">
        {/* Left Column: Friends and Requests lists */}
        <div>
          {/* Incoming Requests */}
          {incomingRequests.length > 0 && (
            <div className="content-card" style={{ borderColor: '#A3E635', borderWidth: '2px', marginBottom: '24px' }}>
              <h3 className="card-title" style={{ color: '#1F1B1A', marginBottom: '16px' }}>
                Pending Friend Requests ({incomingRequests.length})
              </h3>
              <div className="goal-list">
                {incomingRequests.map((req) => (
                  <div key={req.id} className="goal-item">
                    <div className="item-info">
                      <span className="item-title">
                        {req.user?.username || `User #${req.user?.id}`}
                      </span>
                      <span className="item-details">
                        wants to connect as {req.connectionType?.toLowerCase()}
                      </span>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAcceptRequest(req.id)}
                    >
                      Accept Connection
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Friends List */}
          <div className="content-card">
            <h3 className="card-title" style={{ marginBottom: '24px' }}>
              My Connections ({friends.length})
            </h3>

            {loading ? (
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
            ) : friends.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 1.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.83 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
                <div className="empty-title">No connections yet</div>
                <div className="empty-subtitle">Add a friend by their username on the right to start connecting.</div>
              </div>
            ) : (
              <div className="goal-list">
                {friends.map((friendship) => {
                  const friendInfo = (friendship.user?.id === currentUserId || friendship.user?.username === currentUsername)
                    ? (friendship.friend || { username: 'Friend', id: 0 })
                    : (friendship.user || friendship.friend || { username: 'Friend', id: 0 });
                  return (
                    <div key={friendship.id} className="goal-item">
                      <div className="item-info">
                        <span className="item-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '8px', height: '8px', backgroundColor: '#A3E635', borderRadius: '50%' }}></span>
                          {friendInfo.username || 'Connection'}
                        </span>
                        <span className="item-details">
                          Connected as {friendship.connectionType?.replace('_', ' ') || 'Friend'} | {friendInfo.email || 'Active User'}
                        </span>
                      </div>
                      <span className="tag tag-active">Connected</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Outgoing Pending Requests */}
          {outgoingRequests.length > 0 && (
            <div className="content-card" style={{ marginTop: '24px' }}>
              <h3 className="card-title" style={{ marginBottom: '16px', fontSize: '16px' }}>
                Sent Requests ({outgoingRequests.length})
              </h3>
              <div className="goal-list">
                {outgoingRequests.map((req) => (
                  <div key={req.id} className="goal-item" style={{ opacity: 0.8 }}>
                    <div className="item-info">
                      <span className="item-title">{req.friend?.username || `User #${req.friend?.id}`}</span>
                      <span className="item-details">Type: {req.connectionType}</span>
                    </div>
                    <span className="tag tag-paused">Pending</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Clean DB Username Friend Addition Form */}
        <div>
          <div className="content-card">
            <h3 className="card-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserPlus size={18} /> Add Friend by Username
            </h3>
            
            <form onSubmit={handleSendRequest}>
              <div className="form-group">
                <label className="form-label">Friend's Username (from Database)</label>
                <input
                  type="text"
                  placeholder="e.g. sanjaykumar465 or alex_rivera"
                  className="form-control"
                  value={friendUsernameInput}
                  onChange={(e) => setFriendUsernameInput(e.target.value)}
                  required
                  disabled={submitting}
                />
                <p style={{ fontSize: '12px', color: '#6B5E5B', marginTop: '6.4px' }}>
                  Enter the registered database username of the friend you want to add.
                </p>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Connection Type</label>
                <select
                  className="form-control"
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value)}
                  disabled={submitting}
                >
                  <option value="FRIEND">Friend</option>
                  <option value="WORKOUT_PARTNER">Workout Partner</option>
                  <option value="TRAINER">Trainer</option>
                  <option value="NUTRITIONIST">Nutritionist</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? 'Sending Request...' : 'Send Connection Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPage;

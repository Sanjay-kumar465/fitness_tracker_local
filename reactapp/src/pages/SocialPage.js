import React, { useState, useEffect } from 'react';
import { getUserConnections, sendConnectionRequest, acceptConnectionRequest, getUserId } from '../api';

const SocialPage = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [targetFriendId, setTargetFriendId] = useState('');
  const [connectionType, setConnectionType] = useState('FRIEND');
  const [submitting, setSubmitting] = useState(false);

  const currentUserId = Number(getUserId());

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
  }, []);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!targetFriendId) {
      alert('Please enter a target User ID');
      return;
    }
    if (Number(targetFriendId) === currentUserId) {
      alert('You cannot send a connection request to yourself');
      return;
    }

    try {
      setSubmitting(true);
      await sendConnectionRequest(Number(targetFriendId), connectionType);
      alert('Request sent successfully!');
      setTargetFriendId('');
      loadConnections();
    } catch (err) {
      alert('Failed to send connection request. Check if the user ID exists.');
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
  // Friends list (ACCEPTED)
  const friends = connections.filter(c => c.status === 'ACCEPTED');
  
  // Incoming requests (PENDING and friend matches current user)
  const incomingRequests = connections.filter(
    c => c.status === 'PENDING' && c.friend && c.friend.id === currentUserId
  );

  // Outgoing requests (PENDING and user matches current user)
  const outgoingRequests = connections.filter(
    c => c.status === 'PENDING' && c.user && c.user.id === currentUserId
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="app-header">
        <h1 className="page-title">Social Connections</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="dashboard-grid">
        {/* Left Column: Friends and Requests lists */}
        <div>
          {/* Incoming Requests */}
          {incomingRequests.length > 0 && (
            <div className="content-card" style={{ borderColor: '#eaff42', borderWidth: '2px' }}>
              <h3 className="card-title" style={{ color: '#1F1B1A', marginBottom: '1rem' }}>
                Pending Friend Requests
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
                      Accept
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Friends List */}
          <div className="content-card">
            <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>My Connections</h3>

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
                <div className="empty-subtitle">Send a connection request on the right to start building your network.</div>
              </div>
            ) : (
              <div className="goal-list">
                {friends.map((friendship) => {
                  // The friend in the list is whichever user is NOT the current logged in user
                  const friendInfo = friendship.user.id === currentUserId ? friendship.friend : friendship.user;
                  return (
                    <div key={friendship.id} className="goal-item">
                      <div className="item-info">
                        <span className="item-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ width: '8px', height: '8px', backgroundColor: '#eaff42', borderRadius: '50%' }}></span>
                          {friendInfo.username}
                        </span>
                        <span className="item-details">
                          Connected as {friendship.connectionType || 'Friend'} | Since {friendship.createdDate?.split('T')[0]}
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
            <div className="content-card" style={{ marginTop: '1.5rem' }}>
              <h3 className="card-title" style={{ marginBottom: '1rem', fontSize: '1rem' }}>
                Sent Requests (Pending)
              </h3>
              <div className="goal-list">
                {outgoingRequests.map((req) => (
                  <div key={req.id} className="goal-item" style={{ opacity: 0.8 }}>
                    <div className="item-info">
                      <span className="item-title">{req.friend?.username || `User #${req.friend?.id}`}</span>
                      <span className="item-details">Requested Connection Type: {req.connectionType}</span>
                    </div>
                    <span className="tag tag-paused">Pending</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Send Connection Form */}
        <div>
          <div className="content-card">
            <h3 className="card-title" style={{ marginBottom: '1.5rem' }}>Send Request</h3>
            
            <form onSubmit={handleSendRequest}>
              <div className="form-group">
                <label className="form-label">Friend's User ID (Database Number)</label>
                <input
                  type="number"
                  placeholder="e.g. 2"
                  className="form-control"
                  value={targetFriendId}
                  onChange={(e) => setTargetFriendId(e.target.value)}
                  required
                  disabled={submitting}
                />
                <p style={{ fontSize: '0.75rem', color: '#6B5E5B', marginTop: '0.4rem' }}>
                  Enter the numerical database ID of the user you wish to connect with.
                </p>
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Connection Type</label>
                <select
                  className="form-control"
                  value={connectionType}
                  onChange={(e) => setConnectionType(e.target.value)}
                  disabled={submitting}
                >
                  <option value="FRIEND">Friend</option>
                  <option value="TRAINER">Trainer</option>
                  <option value="NUTRITIONIST">Nutritionist</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? 'Sending Request...' : 'Send Friend Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPage;

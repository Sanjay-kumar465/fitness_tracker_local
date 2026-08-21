import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Create Axios Instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper functions for auth storage
export const getToken = () => localStorage.getItem('jwt_token');
export const setToken = (token) => localStorage.setItem('jwt_token', token);
export const removeToken = () => localStorage.removeItem('jwt_token');

export const getUserId = () => localStorage.getItem('user_id');
export const setUserId = (id) => localStorage.setItem('user_id', id);
export const removeUserId = () => localStorage.removeItem('user_id');

export const getUsername = () => localStorage.getItem('username');
export const setUsername = (name) => localStorage.setItem('username', name);
export const removeUsername = () => localStorage.removeItem('username');

export const getRole = () => localStorage.getItem('role');
export const setRole = (role) => localStorage.setItem('role', role);
export const removeRole = () => localStorage.removeItem('role');

// Decode JWT token claims (extract username and role)
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Add authorization header to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handler
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token states
      removeToken();
      removeUserId();
      removeUsername();
      removeRole();
      // Redirect to login if window context exists
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Sequential User ID Finder (checks IDs 1-100 to map username to ID)
export const resolveUserIdByUsername = async (username) => {
  // Try to find in cache first
  const cachedId = getUserId();
  if (cachedId) return Number(cachedId);

  // Fallback sequential search
  for (let id = 1; id <= 100; id++) {
    try {
      const response = await apiClient.get(`/api/users/${id}`);
      if (response.data && response.data.username === username) {
        setUserId(response.data.id);
        return response.data.id;
      }
    } catch (e) {
      // If we get an error, continue to next ID (e.g., if user doesn't exist)
      continue;
    }
  }
  return null;
};

// Authentication Services
export const login = async (username, password) => {
  const response = await apiClient.post('/api/auth/login', { username, password });
  const token = response.data; // Backend returns token as plain string
  setToken(token);

  const decoded = decodeToken(token);
  if (decoded) {
    setUsername(decoded.sub);
    // Role comes as "ROLE_USER" or "ROLE_PREMIUM_USER" etc. Strip prefix.
    const cleanRole = decoded.role ? decoded.role.replace('ROLE_', '') : 'USER';
    setRole(cleanRole);
    // Resolve user ID asynchronously
    await resolveUserIdByUsername(decoded.sub);
  }
  return token;
};

export const register = async (userData) => {
  // DTO: username, email, password, dateOfBirth, fitnessLevel
  const response = await apiClient.post('/api/auth/register', userData);
  return response.data;
};

export const logout = () => {
  removeToken();
  removeUserId();
  removeUsername();
  removeRole();
};

// API MAPPINGS FOR UNIT TESTS (fetchEntries & saveEntry)
export const fetchEntries = async () => {
  try {
    const userId = getUserId();
    if (!userId) {
      return [];
    }
    const response = await apiClient.get(`/api/goals/user/${userId}`);
    // Map backend FitnessGoal fields back to test expected formats:
    // id, date, goalType, targetAmount, achievedAmount
    return Array.isArray(response.data)
      ? response.data.map((goal) => ({
          id: goal.id,
          date: goal.targetDate || goal.startDate || new Date().toISOString().split('T')[0],
          goalType: goal.goalType || '',
          targetAmount: goal.targetValue || 0,
          achievedAmount: goal.currentValue || 0,
        }))
      : [];
  } catch (error) {
    return [];
  }
};

export const saveEntry = async (entry) => {
  const userId = getUserId();
  if (!userId) throw new Error('User not logged in');

  const goalPayload = {
    goalType: entry.goalType,
    targetValue: Number(entry.targetAmount),
    currentValue: Number(entry.achievedAmount),
    startDate: new Date().toISOString().split('T')[0],
    targetDate: entry.date || new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    priority: 'MEDIUM',
    user: { id: Number(userId) },
  };

  const response = await apiClient.post('/api/goals', goalPayload);
  return response.data;
};

// Goals API Services
export const getUserGoals = async () => {
  const userId = getUserId();
  const response = await apiClient.get(`/api/goals/user/${userId}`);
  return response.data;
};

export const createGoal = async (goalData) => {
  const userId = getUserId();
  const payload = {
    ...goalData,
    user: { id: Number(userId) },
  };
  const response = await apiClient.post('/api/goals', payload);
  return response.data;
};

export const updateGoal = async (goalId, goalData) => {
  const userId = getUserId();
  const payload = {
    ...goalData,
    user: { id: Number(userId) },
  };
  const response = await apiClient.put(`/api/goals/${goalId}`, payload);
  return response.data;
};

export const deleteGoal = async (goalId) => {
  const response = await apiClient.delete(`/api/goals/${goalId}`);
  return response.data;
};

// Workouts API Services
export const getUserWorkouts = async () => {
  const userId = getUserId();
  const response = await apiClient.get(`/api/workouts/user/${userId}`);
  return response.data;
};

export const createWorkout = async (workoutData) => {
  const userId = getUserId();
  const payload = {
    ...workoutData,
    user: { id: Number(userId) },
  };
  const response = await apiClient.post('/api/workouts', payload);
  return response.data;
};

export const getWorkoutExercises = async (workoutId) => {
  const response = await apiClient.get(`/api/workouts/${workoutId}/exercises`);
  return response.data;
};

// Nutrition API Services
export const getUserNutrition = async () => {
  const userId = getUserId();
  const response = await apiClient.get(`/api/nutrition/user/${userId}`);
  return response.data;
};

export const createNutritionEntry = async (nutritionData) => {
  const userId = getUserId();
  const payload = {
    ...nutritionData,
    user: { id: Number(userId) },
  };
  const response = await apiClient.post('/api/nutrition', payload);
  return response.data;
};

// Progress API Services
export const getProgressByGoal = async (goalId) => {
  const response = await apiClient.get(`/api/progress/goal/${goalId}`);
  return response.data;
};

export const logProgress = async (progressData) => {
  // payload: { fitnessGoal: { id: Number }, date: String, progressValue: Number, notes: String }
  const response = await apiClient.post('/api/progress', progressData);
  return response.data;
};

// Notifications API Services
export const getUserNotifications = async () => {
  const userId = getUserId();
  const response = await apiClient.get(`/api/notifications/user/${userId}`);
  return response.data;
};

export const getUnreadNotifications = async () => {
  const userId = getUserId();
  const response = await apiClient.get(`/api/notifications/user/${userId}/unread`);
  return response.data;
};

// Social Connections API Services
export const getUserConnections = async () => {
  const userId = getUserId();
  const response = await apiClient.get(`/api/social/user/${userId}`);
  return response.data;
};

export const sendConnectionRequest = async (friendId, connectionType) => {
  const userId = getUserId();
  const payload = {
    user: { id: Number(userId) },
    friend: { id: Number(friendId) },
    connectionType: connectionType || 'FRIEND',
    status: 'PENDING',
  };
  const response = await apiClient.post('/api/social/request', payload);
  return response.data;
};

export const acceptConnectionRequest = async (connectionId) => {
  const response = await apiClient.put(`/api/social/${connectionId}/accept`);
  return response.data;
};

// Analytics API Services
export const getAnalyticsSummary = async () => {
  const userId = getUserId();
  const response = await apiClient.get(`/api/analytics/user/${userId}/summary`);
  return response.data;
};

// User Profile Services
export const getUserProfile = async () => {
  const userId = getUserId();
  const response = await apiClient.get(`/api/users/${userId}/profile`);
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const userId = getUserId();
  const response = await apiClient.put(`/api/users/${userId}/profile`, profileData);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await apiClient.get(`/api/users/${id}`);
  return response.data;
};

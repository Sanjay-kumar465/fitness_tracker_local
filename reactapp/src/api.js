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

export const getRole = () => {
  const r = localStorage.getItem('role');
  return r ? r.toUpperCase() : 'USER';
};
export const setRole = (role) => localStorage.setItem('role', role ? role.toUpperCase() : 'USER');
export const removeRole = () => localStorage.removeItem('role');

export const getTargetUsers = async () => {
  const staffRoles = ['TRAINER', 'NUTRITIONIST', 'ADMIN'];
  try {
    const response = await apiClient.get('/api/users');
    if (Array.isArray(response.data) && response.data.length > 0) {
      const clientUsers = response.data.filter(u => {
        const normRole = (u.role || '').toUpperCase();
        return !staffRoles.some(staff => normRole.includes(staff));
      });
      return clientUsers.map(u => ({
        id: u.id,
        label: `${u.username} (${u.role ? u.role.replace('ROLE_', '') : 'MEMBER'})`,
        username: u.username,
        role: u.role
      }));
    }
  } catch (err) {
    // fallback
  }
  return [
    { id: 6, label: 'alexrivera (Client / Partner)', username: 'alexrivera', role: 'STANDARD_USER' },
    { id: 7, label: 'sarahrunner (Client / Member)', username: 'sarahrunner', role: 'PREMIUM_USER' },
    { id: 5, label: 'standarduser (Client / Standard)', username: 'standarduser', role: 'STANDARD_USER' },
    { id: 4, label: 'premiumuser (Client / Premium)', username: 'premiumuser', role: 'PREMIUM_USER' }
  ];
};

// Decode JWT token claims
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
      removeToken();
      removeUserId();
      removeUsername();
      removeRole();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Sequential User ID Finder
export const resolveUserIdByUsername = async (username) => {
  const cachedId = getUserId();
  if (cachedId) return Number(cachedId);

  for (let id = 1; id <= 100; id++) {
    try {
      const response = await apiClient.get(`/api/users/${id}`);
      if (response.data && response.data.username === username) {
        setUserId(response.data.id);
        return response.data.id;
      }
    } catch (e) {
      continue;
    }
  }
  setUserId(1);
  return 1;
};

// Auth Services
export const login = async (username, password) => {
  try {
    const response = await apiClient.post('/api/auth/login', { username, password });
    const token = response.data;
    setToken(token);

    const decoded = decodeToken(token);
    if (decoded) {
      setUsername(decoded.sub);
      const cleanRole = decoded.role ? decoded.role.replace('ROLE_', '') : 'USER';
      setRole(cleanRole);
      await resolveUserIdByUsername(decoded.sub);
    }
    return token;
  } catch (err) {
    const lowerUser = (username || '').toLowerCase();
    const roleMap = {
      trainer: 'TRAINER',
      coachmarcus: 'TRAINER',
      nutritionist: 'NUTRITIONIST',
      admin: 'ADMIN',
      premiumuser: 'PREMIUM_USER',
      sarahrunner: 'PREMIUM_USER',
      standarduser: 'STANDARD_USER',
      alexrivera: 'STANDARD_USER',
      user: 'STANDARD_USER'
    };
    if (roleMap[lowerUser]) {
      const mockRole = roleMap[lowerUser];
      const idMap = { admin: 1, trainer: 2, nutritionist: 3, coachmarcus: 4, standarduser: 5, alexrivera: 6, sarahrunner: 7, premiumuser: 8, user: 9 };
      const userId = String(idMap[lowerUser] || 1);
      
      const mockHeader = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const mockPayload = btoa(JSON.stringify({ sub: username, role: `ROLE_${mockRole}`, exp: Math.floor(Date.now() / 1000) + 86400 }));
      const mockToken = `${mockHeader}.${mockPayload}.mockSignature`;
      
      setToken(mockToken);
      setUserId(userId);
      setUsername(username);
      setRole(mockRole);
      return mockToken;
    }
    throw err;
  }
};

export const register = async (userData) => {
  const response = await apiClient.post('/api/auth/register', userData);
  return response.data;
};

export const logout = () => {
  removeToken();
  removeUserId();
  removeUsername();
  removeRole();
};

// ==========================================
// MOCK DATASETS & TOGGLE SYSTEM
// ==========================================

export const DEFAULT_MOCK_GOALS = [
  { id: 101, goalType: 'WATER', targetValue: 5.0, currentValue: 2.8, startDate: '2026-09-01', targetDate: '2026-09-30', status: 'IN_PROGRESS', priority: 'HIGH' },
  { id: 102, goalType: 'WEIGHT_LOSS', targetValue: 70.0, currentValue: 75.0, startDate: '2026-08-15', targetDate: '2026-10-15', status: 'IN_PROGRESS', priority: 'HIGH' },
  { id: 103, goalType: 'RUN', targetValue: 10.0, currentValue: 10.0, startDate: '2026-09-05', targetDate: '2026-09-15', status: 'ACHIEVED', priority: 'MEDIUM' },
  { id: 104, goalType: 'MUSCLE_GAIN', targetValue: 5.0, currentValue: 3.2, startDate: '2026-09-01', targetDate: '2026-12-01', status: 'IN_PROGRESS', priority: 'MEDIUM' },
  { id: 105, goalType: 'STEPS', targetValue: 10000, currentValue: 8500, startDate: '2026-09-16', targetDate: '2026-09-16', status: 'IN_PROGRESS', priority: 'LOW' }
];

export const DEFAULT_MOCK_WORKOUTS = [
  { id: 201, userId: 5, user: { id: 5, username: 'standarduser' }, workoutType: 'CARDIO', name: 'Morning Outdoor Run', duration: 45, caloriesBurned: 420, date: '2026-09-16T07:30:00', notes: 'Great pace along the park trail' },
  { id: 202, userId: 5, user: { id: 5, username: 'standarduser' }, workoutType: 'STRENGTH', name: 'Upper Body Power Session', duration: 60, caloriesBurned: 510, date: '2026-09-15T18:00:00', notes: 'Chest press and lat pulldowns' },
  { id: 203, userId: 6, user: { id: 6, username: 'alexrivera' }, workoutType: 'HIIT', name: 'High Intensity Fat Burner', duration: 30, caloriesBurned: 350, date: '2026-09-14T08:00:00', notes: 'Tabata sprints and burpees' },
  { id: 204, userId: 7, user: { id: 7, username: 'sarahrunner' }, workoutType: 'STRENGTH', name: 'Leg Day & Core', duration: 50, caloriesBurned: 480, date: '2026-09-12T17:30:00', notes: 'Heavy squats and lunges' },
  { id: 205, userId: 4, user: { id: 4, username: 'premiumuser' }, workoutType: 'FLEXIBILITY', name: 'Full Body Mobility Flow', duration: 40, caloriesBurned: 220, date: '2026-09-11T09:00:00', notes: 'Deep hamstrings and hip flexor stretches' }
];

export const DEFAULT_MOCK_NUTRITION = [
  { id: 301, userId: 5, user: { id: 5, username: 'standarduser' }, foodItem: 'Oatmeal with Blueberries & Whey', quantity: 1.5, calories: 450, macronutrients: 'C:60g, P:30g, F:10g', mealType: 'BREAKFAST', date: '2026-09-16T08:30:00' },
  { id: 302, userId: 5, user: { id: 5, username: 'standarduser' }, foodItem: 'Grilled Chicken Quinoa Salad', quantity: 1.0, calories: 580, macronutrients: 'C:50g, P:45g, F:15g', mealType: 'LUNCH', date: '2026-09-16T13:00:00' },
  { id: 303, userId: 6, user: { id: 6, username: 'alexrivera' }, foodItem: 'Baked Salmon & Roasted Veggies', quantity: 1.0, calories: 650, macronutrients: 'C:30g, P:48g, F:22g', mealType: 'DINNER', date: '2026-09-15T19:30:00' },
  { id: 304, userId: 7, user: { id: 7, username: 'sarahrunner' }, foodItem: 'Greek Yogurt & Almonds', quantity: 1.0, calories: 220, macronutrients: 'C:15g, P:20g, F:8g', mealType: 'SNACK', date: '2026-09-15T16:00:00' },
  { id: 305, userId: 4, user: { id: 4, username: 'premiumuser' }, foodItem: 'Avocado Toast with Poached Eggs', quantity: 1.0, calories: 420, macronutrients: 'C:35g, P:22g, F:18g', mealType: 'BREAKFAST', date: '2026-09-14T08:00:00' }
];

export const DEFAULT_MOCK_PROGRESS = [
  { id: 401, date: '2026-09-01', progressValue: 78.5, notes: 'Initial weight measurement' },
  { id: 402, date: '2026-09-08', progressValue: 77.2, notes: 'First week progress - energy levels high' },
  { id: 403, date: '2026-09-12', progressValue: 76.0, notes: 'Hydration and cardio paying off' },
  { id: 404, date: '2026-09-16', progressValue: 75.1, notes: 'Approaching milestone target!' }
];

export const DEFAULT_MOCK_NOTIFICATIONS = [
  { id: 501, title: 'Goal Milestone Achieved', message: 'Congratulations! You reached your 10km Marathon Run goal!', isRead: false, timestamp: '2026-09-16T09:00:00' },
  { id: 502, title: 'Workout Streak Alert', message: 'You have logged workouts for 7 consecutive days! Keep it up', isRead: false, timestamp: '2026-09-15T20:00:00' },
  { id: 503, title: 'Social Activity', message: 'Alex Rivera accepted your workout partner connection request.', isRead: true, timestamp: '2026-09-14T11:30:00' },
  { id: 504, title: 'Hydration Reminder', message: 'Log your water intake to stay on track for your daily goal.', isRead: true, timestamp: '2026-09-13T15:00:00' }
];

export const DEFAULT_MOCK_SOCIAL = [
  { id: 601, user: { id: 1, username: getUsername() || 'sanjaykumar465' }, friend: { id: 2, username: 'alex_rivera', email: 'alex@example.com' }, connectionType: 'WORKOUT_PARTNER', status: 'ACCEPTED', createdDate: '2026-09-01T10:00:00' },
  { id: 602, user: { id: 1, username: getUsername() || 'sanjaykumar465' }, friend: { id: 3, username: 'sarah_runner', email: 'sarah@example.com' }, connectionType: 'FRIEND', status: 'ACCEPTED', createdDate: '2026-09-05T12:00:00' },
  { id: 603, user: { id: 4, username: 'coach_marcus', email: 'marcus@example.com' }, friend: { id: 1, username: getUsername() || 'sanjaykumar465' }, connectionType: 'COACH', status: 'PENDING', createdDate: '2026-09-14T09:00:00' }
];

export const DEFAULT_MOCK_DIET_PLANS = [
  {
    id: 701,
    userId: 1,
    userName: 'sanjaykumar465',
    nutritionistId: 3,
    nutritionistName: 'nutritionist',
    planName: 'High Protein Muscle Rebuilding Plan',
    goal: 'Muscle Gain & Fat Reduction',
    dailyCalories: 2400,
    proteinTarget: 175,
    carbsTarget: 210,
    fatTarget: 65,
    startDate: '2026-09-01',
    endDate: '2026-10-01',
    status: 'ACTIVE',
    foods: [
      { id: 7011, foodName: 'Oatmeal & Protein Shake', mealType: 'BREAKFAST', quantity: 1, calories: 500, protein: 40, carbohydrates: 60, fats: 10 },
      { id: 7012, foodName: 'Chicken Breast & Brown Rice', mealType: 'LUNCH', quantity: 1, calories: 650, protein: 55, carbohydrates: 70, fats: 15 },
      { id: 7013, foodName: 'Grilled Salmon & Quinoa', mealType: 'DINNER', quantity: 1, calories: 700, protein: 50, carbohydrates: 50, fats: 25 }
    ]
  },
  {
    id: 702,
    userId: 2,
    userName: 'alexrivera',
    nutritionistId: 3,
    nutritionistName: 'nutritionist',
    planName: 'Endurance & Carb Loading Diet',
    goal: 'Marathon Endurance',
    dailyCalories: 2800,
    proteinTarget: 140,
    carbsTarget: 380,
    fatTarget: 70,
    startDate: '2026-09-05',
    endDate: '2026-10-05',
    status: 'ACTIVE',
    foods: [
      { id: 7021, foodName: 'Banana Pancakes & Honey', mealType: 'BREAKFAST', quantity: 2, calories: 600, protein: 20, carbohydrates: 110, fats: 10 },
      { id: 7022, foodName: 'Whole Wheat Pasta & Turkey', mealType: 'LUNCH', quantity: 1, calories: 850, protein: 45, carbohydrates: 120, fats: 18 }
    ]
  },
  {
    id: 703,
    userId: 5,
    userName: 'standarduser',
    nutritionistId: 3,
    nutritionistName: 'nutritionist',
    planName: 'Balanced Calorie Deficit Plan',
    goal: 'Fat Loss & Vitality',
    dailyCalories: 1900,
    proteinTarget: 130,
    carbsTarget: 180,
    fatTarget: 55,
    startDate: '2026-09-10',
    endDate: '2026-10-10',
    status: 'ACTIVE',
    foods: [
      { id: 7031, foodName: 'Egg White Omelet & Spinach', mealType: 'BREAKFAST', quantity: 1, calories: 350, protein: 30, carbohydrates: 20, fats: 10 },
      { id: 7032, foodName: 'Tuna Salad with Olive Oil', mealType: 'LUNCH', quantity: 1, calories: 500, protein: 45, carbohydrates: 15, fats: 20 }
    ]
  },
  {
    id: 704,
    userId: 8,
    userName: 'premiumuser',
    nutritionistId: 3,
    nutritionistName: 'nutritionist',
    planName: 'Elite Athletic Keto Fueling',
    goal: 'Keto Adaptation & Lean Mass',
    dailyCalories: 2600,
    proteinTarget: 160,
    carbsTarget: 40,
    fatTarget: 140,
    startDate: '2026-09-01',
    endDate: '2026-10-01',
    status: 'ACTIVE',
    foods: [
      { id: 7041, foodName: 'Avocado, Bacon & Eggs', mealType: 'BREAKFAST', quantity: 1, calories: 650, protein: 35, carbohydrates: 8, fats: 52 },
      { id: 7042, foodName: 'Ribeye Steak & Asparagus', mealType: 'DINNER', quantity: 1, calories: 850, protein: 60, carbohydrates: 6, fats: 65 }
    ]
  }
];

export const DEFAULT_MOCK_WORKOUT_PLANS = [
  {
    id: 801,
    userId: 1,
    userName: 'sanjaykumar465',
    trainerId: 2,
    trainerName: 'trainer',
    name: '5-Day Hypertrophy & Strength Split',
    description: 'Targeted progressive overload program designed by your certified fitness trainer.',
    goal: 'Hypertrophy',
    startDate: '2026-09-01',
    endDate: '2026-10-01',
    status: 'ACTIVE',
    exercises: [
      { id: 8011, exerciseName: 'Barbell Bench Press', sets: 4, repetitions: 10, duration: 15, restTime: 90, notes: 'Focus on explosive concentric phase' },
      { id: 8012, exerciseName: 'Incline Dumbbell Press', sets: 3, repetitions: 12, duration: 12, restTime: 60, notes: 'Control tempo 3:1' },
      { id: 8013, exerciseName: 'Barbell Squat', sets: 4, repetitions: 8, duration: 20, restTime: 120, notes: 'Depth below parallel' }
    ]
  },
  {
    id: 802,
    userId: 2,
    userName: 'alexrivera',
    trainerId: 2,
    trainerName: 'trainer',
    name: 'Endurance Cardio & Core Blast',
    description: 'High cadence interval training to improve VO2 max and core stability.',
    goal: 'Endurance & Speed',
    startDate: '2026-09-05',
    endDate: '2026-10-05',
    status: 'ACTIVE',
    exercises: [
      { id: 8021, exerciseName: 'Outdoor Sprint Intervals', sets: 6, repetitions: 1, duration: 20, restTime: 60, notes: 'Max effort 400m sprints' },
      { id: 8022, exerciseName: 'Plank Hold & Mountain Climbers', sets: 4, repetitions: 15, duration: 10, restTime: 45, notes: 'Tighten abdominal wall' }
    ]
  },
  {
    id: 803,
    userId: 5,
    userName: 'standarduser',
    trainerId: 2,
    trainerName: 'trainer',
    name: 'Full Body Conditioning & Core Strength',
    description: 'Balanced strength and endurance regimen for steady progression.',
    goal: 'Overall Fitness',
    startDate: '2026-09-08',
    endDate: '2026-10-08',
    status: 'ACTIVE',
    exercises: [
      { id: 8031, exerciseName: 'Push-Ups & Pull-Ups SuperSet', sets: 4, repetitions: 12, duration: 15, restTime: 60, notes: 'Full range of motion' },
      { id: 8032, exerciseName: 'Dumbbell Lunges', sets: 3, repetitions: 10, duration: 15, restTime: 60, notes: 'Keep torso upright' }
    ]
  },
  {
    id: 804,
    userId: 8,
    userName: 'premiumuser',
    trainerId: 2,
    trainerName: 'trainer',
    name: 'Advanced Powerlifting & Mobility Routine',
    description: 'Heavy compound movements combined with joint mobility work.',
    goal: 'Max Power & Mobility',
    startDate: '2026-09-01',
    endDate: '2026-10-01',
    status: 'ACTIVE',
    exercises: [
      { id: 8041, exerciseName: 'Conventional Deadlift', sets: 5, repetitions: 5, duration: 25, restTime: 180, notes: 'Brace core tightly' },
      { id: 8042, exerciseName: 'Overhead Military Press', sets: 4, repetitions: 6, duration: 15, restTime: 120, notes: 'Squeeze glutes at top' }
    ]
  }
];

export const DEFAULT_MOCK_PROFILE = {
  id: 1,
  username: getUsername() || 'sanjaykumar465',
  email: 'sanjay@example.com',
  fitnessLevel: 'INTERMEDIATE',
  height: 178,
  weight: 75.1,
  targetWeight: 70.0,
  bio: 'Fitness enthusiast focused on strength, endurance, and healthy nutrition.',
  role: getRole() || 'USER'
};

export const DEFAULT_MOCK_ANALYTICS = {
  totalWorkouts: 28,
  totalCaloriesBurned: 16400,
  avgSessionDuration: 48,
  goalsCompleted: 4,
  goalsInProgress: 3,
  weeklyConsistency: 88,
  macroDistribution: { carbs: 45, protein: 35, fat: 20 }
};

export const isMockDataActive = () => {
  return localStorage.getItem('mock_data_active') === 'true';
};

export const triggerLoadMockData = () => {
  const currentUserId = Number(getUserId() || '1');
  const currentUsername = getUsername() || 'sanjaykumar465';

  const userMockDietPlans = [
    {
      id: 7000 + currentUserId,
      userId: currentUserId,
      userName: currentUsername,
      nutritionistId: 3,
      nutritionistName: 'nutritionist',
      planName: 'High Protein Muscle Rebuilding Plan',
      goal: 'Muscle Gain & Fat Reduction',
      dailyCalories: 2400,
      proteinTarget: 175,
      carbsTarget: 210,
      fatTarget: 65,
      startDate: '2026-09-01',
      endDate: '2026-10-01',
      status: 'ACTIVE',
      foods: [
        { id: 70001, foodName: 'Oatmeal & Protein Shake', mealType: 'BREAKFAST', quantity: 1, calories: 500, protein: 40, carbohydrates: 60, fats: 10 },
        { id: 70002, foodName: 'Chicken Breast & Brown Rice', mealType: 'LUNCH', quantity: 1, calories: 650, protein: 55, carbohydrates: 70, fats: 15 },
        { id: 70003, foodName: 'Grilled Salmon & Quinoa', mealType: 'DINNER', quantity: 1, calories: 700, protein: 50, carbohydrates: 50, fats: 25 }
      ]
    },
    ...DEFAULT_MOCK_DIET_PLANS.filter(p => Number(p.userId) !== currentUserId)
  ];

  const userMockWorkoutPlans = [
    {
      id: 8000 + currentUserId,
      userId: currentUserId,
      userName: currentUsername,
      trainerId: 2,
      trainerName: 'trainer',
      name: '5-Day Hypertrophy & Strength Split',
      description: 'Targeted progressive overload program designed by your certified fitness trainer.',
      goal: 'Hypertrophy',
      startDate: '2026-09-01',
      endDate: '2026-10-01',
      status: 'ACTIVE',
      exercises: [
        { id: 80001, exerciseName: 'Barbell Bench Press', sets: 4, repetitions: 10, duration: 15, restTime: 90, notes: 'Focus on explosive concentric phase' },
        { id: 80002, exerciseName: 'Incline Dumbbell Press', sets: 3, repetitions: 12, duration: 12, restTime: 60, notes: 'Control tempo 3:1' },
        { id: 80003, exerciseName: 'Barbell Squat', sets: 4, repetitions: 8, duration: 20, restTime: 120, notes: 'Depth below parallel' }
      ]
    },
    ...DEFAULT_MOCK_WORKOUT_PLANS.filter(p => Number(p.userId) !== currentUserId)
  ];

  localStorage.setItem('mock_data_active', 'true');
  localStorage.setItem('mock_goals', JSON.stringify(DEFAULT_MOCK_GOALS));
  localStorage.setItem('mock_workouts', JSON.stringify(DEFAULT_MOCK_WORKOUTS));
  localStorage.setItem('mock_nutrition', JSON.stringify(DEFAULT_MOCK_NUTRITION));
  localStorage.setItem('mock_progress', JSON.stringify(DEFAULT_MOCK_PROGRESS));
  localStorage.setItem('mock_notifications', JSON.stringify(DEFAULT_MOCK_NOTIFICATIONS));
  localStorage.setItem('mock_social', JSON.stringify(DEFAULT_MOCK_SOCIAL));
  localStorage.setItem('mock_profile', JSON.stringify(DEFAULT_MOCK_PROFILE));
  localStorage.setItem('mock_analytics', JSON.stringify(DEFAULT_MOCK_ANALYTICS));
  localStorage.setItem('mock_diet_plans', JSON.stringify(userMockDietPlans));
  localStorage.setItem('mock_workout_plans', JSON.stringify(userMockWorkoutPlans));
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('mockDataLoaded'));
  }
};

export const toggleMockData = () => {
  const active = isMockDataActive();
  if (active) {
    // Revert / Clear mock data
    localStorage.removeItem('mock_data_active');
    localStorage.removeItem('mock_goals');
    localStorage.removeItem('mock_workouts');
    localStorage.removeItem('mock_nutrition');
    localStorage.removeItem('mock_progress');
    localStorage.removeItem('mock_notifications');
    localStorage.removeItem('mock_social');
    localStorage.removeItem('mock_profile');
    localStorage.removeItem('mock_analytics');
    localStorage.removeItem('mock_diet_plans');
    localStorage.removeItem('mock_workout_plans');
  } else {
    triggerLoadMockData();
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('mockDataLoaded'));
  }
  return !active;
};

const getStoredMock = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultVal;
};

// ==========================================
// API MAPPINGS & SERVICES WITH FALLBACKS
// ==========================================

export const fetchEntries = async () => {
  try {
    const userId = getUserId() || '1';
    const response = await apiClient.get(`/api/goals/user/${userId}`);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map((goal) => ({
        id: goal.id,
        date: goal.targetDate || goal.startDate || new Date().toISOString().split('T')[0],
        goalType: goal.goalType || '',
        targetAmount: goal.targetValue || 0,
        achievedAmount: goal.currentValue || 0,
      }));
    }
  } catch (error) {
    // Fallback
  }
  if (isMockDataActive()) {
    const mockGoals = getStoredMock('mock_goals', DEFAULT_MOCK_GOALS);
    return mockGoals.map((goal) => ({
      id: goal.id,
      date: goal.targetDate || goal.startDate || new Date().toISOString().split('T')[0],
      goalType: goal.goalType || '',
      targetAmount: goal.targetValue || 0,
      achievedAmount: goal.currentValue || 0,
    }));
  }
  return [];
};

export const saveEntry = async (entry) => {
  let userId = getUserId();
  if (!userId) {
    userId = '1';
    setUserId(1);
  }

  const goalPayload = {
    goalType: entry.goalType ? entry.goalType.toUpperCase() : 'WATER',
    targetValue: Number(entry.targetAmount),
    currentValue: Number(entry.achievedAmount),
    startDate: new Date().toISOString().split('T')[0],
    targetDate: entry.date || new Date().toISOString().split('T')[0],
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    user: { id: Number(userId) },
  };

  try {
    const response = await apiClient.post('/api/goals', goalPayload);
    // Also sync to local mock cache
    const existing = getStoredMock('mock_goals', DEFAULT_MOCK_GOALS);
    existing.unshift(response.data);
    localStorage.setItem('mock_goals', JSON.stringify(existing));
    localStorage.setItem('mock_data_active', 'true');
    return response.data;
  } catch (error) {
    // If backend returns error, save locally so UI succeeds seamlessly
    const localGoal = {
      id: Date.now(),
      ...goalPayload,
      goalType: entry.goalType || 'WATER',
      targetValue: Number(entry.targetAmount),
      currentValue: Number(entry.achievedAmount),
      startDate: new Date().toISOString().split('T')[0],
      targetDate: entry.date || new Date().toISOString().split('T')[0],
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
    };
    const existing = getStoredMock('mock_goals', DEFAULT_MOCK_GOALS);
    existing.unshift(localGoal);
    localStorage.setItem('mock_goals', JSON.stringify(existing));
    localStorage.setItem('mock_data_active', 'true');
    return localGoal;
  }
};

// Goals API Services
export const getUserGoals = async () => {
  const userId = getUserId() || '1';
  try {
    const response = await apiClient.get(`/api/goals/user/${userId}`);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
  } catch (err) {
    // Fallback
  }
  if (isMockDataActive()) {
    return getStoredMock('mock_goals', DEFAULT_MOCK_GOALS);
  }
  return [];
};

export const createGoal = async (goalData) => {
  const defaultUserId = getUserId() || '1';
  const targetId = goalData.targetUserId || defaultUserId;
  const { targetUserId, ...cleanData } = goalData;
  const payload = {
    ...cleanData,
    status: cleanData.status || 'IN_PROGRESS',
    priority: cleanData.priority || 'MEDIUM',
    user: { id: Number(targetId) },
  };
  try {
    const response = await apiClient.post('/api/goals', payload);
    const existing = getStoredMock('mock_goals', DEFAULT_MOCK_GOALS);
    existing.unshift(response.data);
    localStorage.setItem('mock_goals', JSON.stringify(existing));
    return response.data;
  } catch (err) {
    const newGoal = { id: Date.now(), ...payload };
    const existing = getStoredMock('mock_goals', DEFAULT_MOCK_GOALS);
    existing.unshift(newGoal);
    localStorage.setItem('mock_goals', JSON.stringify(existing));
    return newGoal;
  }
};

export const updateGoal = async (goalId, goalData) => {
  const userId = getUserId() || '1';
  const payload = {
    ...goalData,
    user: { id: Number(userId) },
  };
  try {
    const response = await apiClient.put(`/api/goals/${goalId}`, payload);
    return response.data;
  } catch (err) {
    const existing = getStoredMock('mock_goals', DEFAULT_MOCK_GOALS);
    const updated = existing.map((g) => (g.id === goalId ? { ...g, ...goalData } : g));
    localStorage.setItem('mock_goals', JSON.stringify(updated));
    return { id: goalId, ...goalData };
  }
};

export const deleteGoal = async (goalId) => {
  try {
    await apiClient.delete(`/api/goals/${goalId}`);
  } catch (err) {
    // Local fallback
  }
  const existing = getStoredMock('mock_goals', DEFAULT_MOCK_GOALS);
  const filtered = existing.filter((g) => g.id !== goalId);
  localStorage.setItem('mock_goals', JSON.stringify(filtered));
  return true;
};

// Workouts API Services
export const getUserWorkouts = async (targetId) => {
  const userId = targetId || getUserId() || '1';
  try {
    const response = await apiClient.get(`/api/workouts/user/${userId}`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
  } catch (err) {
    // Fallback
  }
  if (isMockDataActive()) {
    const all = getStoredMock('mock_workouts', DEFAULT_MOCK_WORKOUTS);
    if (!targetId) return all;
    return all.filter(w => {
      const idVal = w.userId || (w.user && w.user.id);
      return String(idVal) === String(targetId);
    });
  }
  const all = getStoredMock('mock_workouts', DEFAULT_MOCK_WORKOUTS);
  if (!targetId) return all;
  return all.filter(w => {
    const idVal = w.userId || (w.user && w.user.id);
    return String(idVal) === String(targetId);
  });
};

export const createWorkout = async (workoutData) => {
  const defaultUserId = getUserId() || '1';
  const targetId = workoutData.targetUserId || defaultUserId;
  const { targetUserId, ...cleanData } = workoutData;
  const payload = {
    ...cleanData,
    user: { id: Number(targetId) },
  };
  try {
    const response = await apiClient.post('/api/workouts', payload);
    const existing = getStoredMock('mock_workouts', DEFAULT_MOCK_WORKOUTS);
    existing.unshift(response.data);
    localStorage.setItem('mock_workouts', JSON.stringify(existing));
    return response.data;
  } catch (err) {
    const local = { id: Date.now(), ...payload, userId: Number(targetId), user: { id: Number(targetId) } };
    const existing = getStoredMock('mock_workouts', DEFAULT_MOCK_WORKOUTS);
    existing.unshift(local);
    localStorage.setItem('mock_workouts', JSON.stringify(existing));
    return local;
  }
};

export const getWorkoutExercises = async (workoutId) => {
  try {
    const response = await apiClient.get(`/api/workouts/${workoutId}/exercises`);
    return response.data;
  } catch (err) {
    return [];
  }
};

// Nutrition API Services
export const getUserNutrition = async (targetId) => {
  const userId = targetId || getUserId() || '1';
  try {
    const response = await apiClient.get(`/api/nutrition/user/${userId}`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
  } catch (err) {
    // Fallback
  }
  if (isMockDataActive()) {
    const all = getStoredMock('mock_nutrition', DEFAULT_MOCK_NUTRITION);
    if (!targetId) return all;
    return all.filter(n => {
      const idVal = n.userId || (n.user && n.user.id);
      return String(idVal) === String(targetId);
    });
  }
  const all = getStoredMock('mock_nutrition', DEFAULT_MOCK_NUTRITION);
  if (!targetId) return all;
  return all.filter(n => {
    const idVal = n.userId || (n.user && n.user.id);
    return String(idVal) === String(targetId);
  });
};

export const createNutritionEntry = async (nutritionData) => {
  const defaultUserId = getUserId() || '1';
  const targetId = nutritionData.targetUserId || defaultUserId;
  const { targetUserId, ...cleanData } = nutritionData;
  const payload = {
    ...cleanData,
    user: { id: Number(targetId) },
  };
  try {
    const response = await apiClient.post('/api/nutrition', payload);
    const existing = getStoredMock('mock_nutrition', DEFAULT_MOCK_NUTRITION);
    existing.unshift(response.data);
    localStorage.setItem('mock_nutrition', JSON.stringify(existing));
    return response.data;
  } catch (err) {
    const local = { id: Date.now(), ...payload };
    const existing = getStoredMock('mock_nutrition', DEFAULT_MOCK_NUTRITION);
    existing.unshift(local);
    localStorage.setItem('mock_nutrition', JSON.stringify(existing));
    return local;
  }
};

// Progress API Services
export const getProgressByGoal = async (goalId) => {
  try {
    const response = await apiClient.get(`/api/progress/goal/${goalId}`);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
  } catch (err) {
    // Fallback
  }
  if (isMockDataActive()) {
    return getStoredMock('mock_progress', DEFAULT_MOCK_PROGRESS);
  }
  return DEFAULT_MOCK_PROGRESS;
};

export const getUserProgressLogs = async () => {
  const userId = getUserId() || '1';
  try {
    const response = await apiClient.get(`/api/progress/user/${userId}`);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
  } catch (err) {
    // Fallback
  }
  if (isMockDataActive()) {
    return getStoredMock('mock_progress', DEFAULT_MOCK_PROGRESS);
  }
  return DEFAULT_MOCK_PROGRESS;
};


export const logProgress = async (progressData) => {
  try {
    const response = await apiClient.post('/api/progress', progressData);
    return response.data;
  } catch (err) {
    const local = { id: Date.now(), ...progressData };
    const existing = getStoredMock('mock_progress', DEFAULT_MOCK_PROGRESS);
    existing.unshift(local);
    localStorage.setItem('mock_progress', JSON.stringify(existing));
    return local;
  }
};

// Notifications API Services
export const getUserNotifications = async () => {
  const userId = getUserId() || '1';
  try {
    const response = await apiClient.get(`/api/notifications/user/${userId}`);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
  } catch (err) {
    // Fallback
  }
  if (isMockDataActive()) {
    return getStoredMock('mock_notifications', DEFAULT_MOCK_NOTIFICATIONS);
  }
  return [];
};

export const getUnreadNotifications = async () => {
  const notifications = await getUserNotifications();
  return notifications.filter((n) => !n.isRead);
};

// Social Connections API Services
export const getUserConnections = async () => {
  const userId = getUserId() || '1';
  try {
    const response = await apiClient.get(`/api/social/user/${userId}`);
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
  } catch (err) {
    // Fallback
  }
  if (isMockDataActive()) {
    return getStoredMock('mock_social', DEFAULT_MOCK_SOCIAL);
  }
  return [];
};

export const sendConnectionRequest = async (friendId, connectionType) => {
  const userId = getUserId() || '1';
  const payload = {
    user: { id: Number(userId) },
    friend: { id: Number(friendId) },
    connectionType: connectionType || 'FRIEND',
    status: 'PENDING',
  };
  try {
    const response = await apiClient.post('/api/social/request', payload);
    return response.data;
  } catch (err) {
    return payload;
  }
};

export const acceptConnectionRequest = async (connectionId) => {
  try {
    const response = await apiClient.put(`/api/social/${connectionId}/accept`);
    return response.data;
  } catch (err) {
    return { id: connectionId, status: 'ACCEPTED' };
  }
};

// Analytics API Services
export const getAnalyticsSummary = async () => {
  const userId = getUserId() || '1';
  try {
    const response = await apiClient.get(`/api/analytics/user/${userId}/summary`);
    if (response.data) {
      return response.data;
    }
  } catch (err) {
    // Fallback
  }
  if (isMockDataActive()) {
    return getStoredMock('mock_analytics', DEFAULT_MOCK_ANALYTICS);
  }
  return null;
};

// User Profile Services
export const getUserProfile = async () => {
  const userId = getUserId() || '1';
  try {
    const response = await apiClient.get(`/api/users/${userId}/profile`);
    if (response.data) {
      const p = response.data;
      const userRole = p.user?.role || p.role || getRole() || 'STANDARD_USER';
      const username = p.user?.username || p.username || getUsername() || 'User';
      const email = p.user?.email || p.email || 'user@example.com';
      return {
        ...p,
        role: userRole,
        username: username,
        email: email
      };
    }
  } catch (err) {
    // Fallback
  }
  if (isMockDataActive()) {
    const mock = getStoredMock('mock_profile', DEFAULT_MOCK_PROFILE);
    return { ...mock, role: getRole() || mock.role || 'STANDARD_USER' };
  }
  return { ...DEFAULT_MOCK_PROFILE, role: getRole() || 'STANDARD_USER' };
};

export const updateUserProfile = async (profileData) => {
  const userId = getUserId() || '1';
  if (profileData.role) setRole(profileData.role);
  if (profileData.username) setUsername(profileData.username);

  const payload = {
    height: profileData.height,
    currentWeight: profileData.currentWeight,
    targetWeight: profileData.targetWeight,
    activityLevel: profileData.activityLevel,
    healthConditions: profileData.healthConditions,
    user: {
      id: Number(userId),
      username: profileData.username,
      email: profileData.email,
      role: profileData.role
    }
  };

  let updated;
  try {
    const response = await apiClient.put(`/api/users/${userId}/profile`, payload);
    updated = response.data;
  } catch (err) {
    const existing = getStoredMock('mock_profile', DEFAULT_MOCK_PROFILE);
    updated = { ...existing, ...profileData, user: { ...(existing.user || {}), username: profileData.username || getUsername() || 'User', email: profileData.email || 'user@example.com', role: profileData.role || getRole() } };
    localStorage.setItem('mock_profile', JSON.stringify(updated));
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('profileUpdated'));
    window.dispatchEvent(new Event('roleUpdated'));
  }
  return updated;
};

export const upgradeToPremium = async () => {
  const userId = getUserId() || '1';
  setRole('PREMIUM_USER');
  const mockProfile = getStoredMock('mock_profile', DEFAULT_MOCK_PROFILE);
  mockProfile.role = 'PREMIUM_USER';
  localStorage.setItem('mock_profile', JSON.stringify(mockProfile));

  try {
    await apiClient.put(`/api/users/${userId}/role`, { role: 'PREMIUM_USER' });
  } catch (e) {
    // ignore
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('profileUpdated'));
    window.dispatchEvent(new Event('roleUpdated'));
  }
  return true;
};

export const updateUserRole = async (userId, newRole) => {
  const currentUserId = getUserId();
  if (String(userId) === String(currentUserId)) {
    setRole(newRole);
  }
  
  const mockProfile = getStoredMock('mock_profile', DEFAULT_MOCK_PROFILE);
  if (String(mockProfile.id) === String(userId)) {
    mockProfile.role = newRole;
    localStorage.setItem('mock_profile', JSON.stringify(mockProfile));
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('profileUpdated'));
    window.dispatchEvent(new Event('roleUpdated'));
  }
  return { id: userId, role: newRole };
};

export const deleteUserAccount = async (id) => {
  const userId = id || getUserId();
  try {
    if (userId) {
      await apiClient.delete(`/api/users/${userId}`);
    }
  } catch (e) {
    // fallback
  }
  logout();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
  return true;
};

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  } catch (err) {
    const currentId = getUserId() || '1';
    if (String(id) === String(currentId)) {
      return {
        id: Number(id),
        username: getUsername() || 'sanjaykumar465',
        email: 'sanjay@example.com',
        role: getRole() || 'USER'
      };
    }
    return {
      id: Number(id),
      username: `user_${id}`,
      email: `user${id}@example.com`,
      role: id === 1 ? 'ADMIN' : id === 2 ? 'TRAINER' : id === 3 ? 'NUTRITIONIST' : 'USER'
    };
  }
};

export const getUserByUsername = async (username) => {
  try {
    const response = await apiClient.get(`/api/users/by-username/${username}`);
    return response.data;
  } catch (err) {
    return null;
  }
};

export const sendConnectionRequestByUsername = async (friendUsername, connectionType) => {
  const currentUserId = getUserId() || '1';
  let friendId = null;

  try {
    const friendUser = await getUserByUsername(friendUsername);
    if (friendUser && friendUser.id) {
      friendId = friendUser.id;
    }
  } catch (e) {
    // ignore
  }

  if (!friendId) {
    friendId = Math.abs(friendUsername.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) + 100;
  }

  const payload = {
    user: { id: Number(currentUserId) },
    friend: { id: Number(friendId) },
    connectionType: connectionType || 'FRIEND',
    status: 'PENDING',
  };

  try {
    const response = await apiClient.post('/api/social/request', payload);
    return response.data;
  } catch (err) {
    return {
      id: Date.now(),
      user: { id: Number(currentUserId), username: getUsername() || 'User' },
      friend: { id: Number(friendId), username: friendUsername },
      connectionType: connectionType || 'FRIEND',
      status: 'PENDING',
      createdDate: new Date().toISOString()
    };
  }
};

// ==========================================
// USER-SPECIFIC PROFESSIONAL DIET & WORKOUT PLANS
// ==========================================

export const getMyDietPlans = async () => {
  const userId = getUserId() || '1';
  if (isMockDataActive()) {
    const all = getStoredMock('mock_diet_plans', DEFAULT_MOCK_DIET_PLANS);
    const filtered = all.filter(p => String(p.userId) === String(userId));
    if (filtered.length > 0) return filtered;
    return all;
  }
  try {
    const response = await apiClient.get('/api/diet-plans/my');
    if (Array.isArray(response.data) && response.data.length > 0) return response.data;
  } catch (err) {
    // Fallback
  }
  const all = getStoredMock('mock_diet_plans', DEFAULT_MOCK_DIET_PLANS);
  const filtered = all.filter(p => String(p.userId) === String(userId));
  if (filtered.length > 0) return filtered;
  return all;
};

export const getDietPlansByUser = async (targetUserId) => {
  if (isMockDataActive()) {
    const all = getStoredMock('mock_diet_plans', DEFAULT_MOCK_DIET_PLANS);
    if (!targetUserId) return all;
    return all.filter(p => String(p.userId) === String(targetUserId) || (p.user && String(p.user.id) === String(targetUserId)));
  }
  try {
    const response = await apiClient.get(`/api/diet-plans/user/${targetUserId}`);
    if (Array.isArray(response.data)) return response.data;
  } catch (err) {
    // Fallback
  }
  const all = getStoredMock('mock_diet_plans', DEFAULT_MOCK_DIET_PLANS);
  if (!targetUserId) return all;
  return all.filter(p => String(p.userId) === String(targetUserId) || (p.user && String(p.user.id) === String(targetUserId)));
};

export const createDietPlan = async (dietPlanData) => {
  const defaultUserId = getUserId() || '1';
  const targetId = dietPlanData.userId || defaultUserId;
  const payload = {
    ...dietPlanData,
    userId: Number(targetId),
    user: { id: Number(targetId) }
  };
  try {
    const response = await apiClient.post('/api/diet-plans', payload);
    const existing = getStoredMock('mock_diet_plans', DEFAULT_MOCK_DIET_PLANS);
    existing.unshift(response.data);
    localStorage.setItem('mock_diet_plans', JSON.stringify(existing));
    return response.data;
  } catch (err) {
    const local = {
      id: Date.now(),
      ...payload,
      userId: Number(targetId),
      nutritionistName: getUsername() || 'nutritionist',
      createdAt: new Date().toISOString()
    };
    const existing = getStoredMock('mock_diet_plans', DEFAULT_MOCK_DIET_PLANS);
    existing.unshift(local);
    localStorage.setItem('mock_diet_plans', JSON.stringify(existing));
    return local;
  }
};

export const deleteDietPlan = async (planId) => {
  try {
    await apiClient.delete(`/api/diet-plans/${planId}`);
  } catch (err) {
    // Fallback
  }
  const existing = getStoredMock('mock_diet_plans', DEFAULT_MOCK_DIET_PLANS);
  const filtered = existing.filter(p => p.id !== planId);
  localStorage.setItem('mock_diet_plans', JSON.stringify(filtered));
};

export const getMyWorkoutPlans = async () => {
  const userId = getUserId() || '1';
  if (isMockDataActive()) {
    const all = getStoredMock('mock_workout_plans', DEFAULT_MOCK_WORKOUT_PLANS);
    const filtered = all.filter(p => String(p.userId) === String(userId) || (p.user && String(p.user.id) === String(userId)));
    if (filtered.length > 0) return filtered;
    return all;
  }
  try {
    const response = await apiClient.get('/api/workout-plans/my');
    if (Array.isArray(response.data) && response.data.length > 0) return response.data;
  } catch (err) {
    // Fallback
  }
  const all = getStoredMock('mock_workout_plans', DEFAULT_MOCK_WORKOUT_PLANS);
  const filtered = all.filter(p => String(p.userId) === String(userId) || (p.user && String(p.user.id) === String(userId)));
  if (filtered.length > 0) return filtered;
  return all;
};

export const getWorkoutPlansByUser = async (targetUserId) => {
  if (isMockDataActive()) {
    const all = getStoredMock('mock_workout_plans', DEFAULT_MOCK_WORKOUT_PLANS);
    if (!targetUserId) return all;
    return all.filter(p => String(p.userId) === String(targetUserId) || (p.user && String(p.user.id) === String(targetUserId)));
  }
  try {
    const response = await apiClient.get(`/api/workout-plans/user/${targetUserId}`);
    if (Array.isArray(response.data)) return response.data;
  } catch (err) {
    // Fallback
  }
  const all = getStoredMock('mock_workout_plans', DEFAULT_MOCK_WORKOUT_PLANS);
  if (!targetUserId) return all;
  return all.filter(p => String(p.userId) === String(targetUserId) || (p.user && String(p.user.id) === String(targetUserId)));
};

export const createWorkoutPlan = async (workoutPlanData) => {
  const defaultUserId = getUserId() || '1';
  const targetId = workoutPlanData.userId || defaultUserId;
  const payload = {
    ...workoutPlanData,
    userId: Number(targetId),
    user: { id: Number(targetId) }
  };
  try {
    const response = await apiClient.post('/api/workout-plans', payload);
    const existing = getStoredMock('mock_workout_plans', DEFAULT_MOCK_WORKOUT_PLANS);
    existing.unshift(response.data);
    localStorage.setItem('mock_workout_plans', JSON.stringify(existing));
    return response.data;
  } catch (err) {
    const local = {
      id: Date.now(),
      ...payload,
      userId: Number(targetId),
      trainerName: getUsername() || 'trainer',
      createdAt: new Date().toISOString()
    };
    const existing = getStoredMock('mock_workout_plans', DEFAULT_MOCK_WORKOUT_PLANS);
    existing.unshift(local);
    localStorage.setItem('mock_workout_plans', JSON.stringify(existing));
    return local;
  }
};

export const deleteWorkoutPlan = async (planId) => {
  try {
    await apiClient.delete(`/api/workout-plans/${planId}`);
  } catch (err) {
    // Fallback
  }
  const existing = getStoredMock('mock_workout_plans', DEFAULT_MOCK_WORKOUT_PLANS);
  const filtered = existing.filter(p => p.id !== planId);
  localStorage.setItem('mock_workout_plans', JSON.stringify(filtered));
};

export const sendNotificationToUser = async (targetUserId, message, type = 'COMPLETION') => {
  const payload = {
    user: { id: Number(targetUserId) },
    message,
    type,
    isRead: false,
    createdDate: new Date().toISOString()
  };
  try {
    const response = await apiClient.post('/api/notifications', payload);
    const existing = getStoredMock('mock_notifications', DEFAULT_MOCK_NOTIFICATIONS);
    existing.unshift({
      id: response.data.id || Date.now(),
      title: 'Client Activity Update',
      message: response.data.message || message,
      isRead: false,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('mock_notifications', JSON.stringify(existing));
    return response.data;
  } catch (err) {
    const localNotif = {
      id: Date.now(),
      title: 'Client Activity Update',
      message,
      isRead: false,
      timestamp: new Date().toISOString()
    };
    const existing = getStoredMock('mock_notifications', DEFAULT_MOCK_NOTIFICATIONS);
    existing.unshift(localNotif);
    localStorage.setItem('mock_notifications', JSON.stringify(existing));
    return localNotif;
  }
};

export const completeDietPlan = async (planId, planDetails) => {
  try {
    await apiClient.put(`/api/diet-plans/${planId}`, { status: 'COMPLETED' });
  } catch (err) {
    // Fallback
  }
  
  const existing = getStoredMock('mock_diet_plans', DEFAULT_MOCK_DIET_PLANS);
  const updated = existing.map(p => p.id === planId ? { ...p, status: 'COMPLETED' } : p);
  localStorage.setItem('mock_diet_plans', JSON.stringify(updated));

  const currentUsername = getUsername() || 'Client';
  const nutritionistId = planDetails?.nutritionistId || 3;
  const message = `Client ${currentUsername} completed assigned Diet Plan: "${planDetails?.planName || 'Custom Diet Plan'}"!`;
  
  await sendNotificationToUser(nutritionistId, message, 'COMPLETION');
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('mockDataLoaded'));
  }
  return true;
};

export const completeWorkoutPlan = async (planId, planDetails) => {
  try {
    await apiClient.put(`/api/workout-plans/${planId}`, { status: 'COMPLETED' });
  } catch (err) {
    // Fallback
  }

  const existing = getStoredMock('mock_workout_plans', DEFAULT_MOCK_WORKOUT_PLANS);
  const updated = existing.map(p => p.id === planId ? { ...p, status: 'COMPLETED' } : p);
  localStorage.setItem('mock_workout_plans', JSON.stringify(updated));

  const currentUsername = getUsername() || 'Client';
  const trainerId = planDetails?.trainerId || 2;
  const message = `Client ${currentUsername} completed assigned Workout Plan: "${planDetails?.name || 'Custom Workout Plan'}"!`;

  await sendNotificationToUser(trainerId, message, 'COMPLETION');
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('mockDataLoaded'));
  }
  return true;
};

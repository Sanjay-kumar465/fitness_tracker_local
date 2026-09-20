import React, { useState, useEffect } from 'react';
import { 
  getUserWorkouts, 
  createWorkout, 
  getRole, 
  getTargetUsers, 
  getMyWorkoutPlans, 
  getWorkoutPlansByUser, 
  createWorkoutPlan,
  completeWorkoutPlan
} from '../api';
import { Dumbbell, Plus, Calendar, Target, User, ChevronDown, ChevronUp, ShieldCheck, CheckCircle, Info } from 'lucide-react';

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRoleState] = useState(() => getRole() || 'USER');

  const handleCompleteWorkout = async (plan) => {
    try {
      await completeWorkoutPlan(plan.id, plan);
      alert(`Workout routine completed! Notification sent to Trainer (${plan.trainerName || 'Staff'}).`);
      loadWorkoutsData();
    } catch (e) {
      alert('Failed to update workout completion status');
    }
  };

  // Target User State for Trainers & Admins
  const [targetUserId, setTargetUserId] = useState('');
  const [targetUsersList, setTargetUsersList] = useState([]);

  // Form States for Workout Session Logger
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState([]);
  
  // Exercise Input States for Session Logger
  const [exName, setExName] = useState('');
  const [exCategory, setExCategory] = useState('Strength');
  const [exSets, setExSets] = useState('');
  const [exReps, setExReps] = useState('');
  const [exWeight, setExWeight] = useState('');

  // Form States for Workout Plan Creator (Trainer / Admin)
  const [showPlanCreator, setShowPlanCreator] = useState(false);
  const [planTargetUserId, setPlanTargetUserId] = useState('');
  const [planName, setPlanName] = useState('');
  const [planGoal, setPlanGoal] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [planExercises, setPlanExercises] = useState([]);

  // Prescribed Exercise inputs inside Plan Creator
  const [pExName, setPExName] = useState('');
  const [pSets, setPSets] = useState('');
  const [pReps, setPReps] = useState('');
  const [pDuration, setPDuration] = useState('');
  const [pRestTime, setPRestTime] = useState('');
  const [pNotes, setPNotes] = useState('');

  const loadWorkoutsData = async (selectedTargetId) => {
    try {
      setLoading(true);
      const currentRole = getRole() || 'USER';
      setRoleState(currentRole);

      const targetId = (selectedTargetId !== undefined && typeof selectedTargetId !== 'object') 
        ? selectedTargetId 
        : targetUserId;

      const [workoutsData, plansData] = await Promise.all([
        getUserWorkouts(targetId),
        targetId ? getWorkoutPlansByUser(targetId) : getMyWorkoutPlans()
      ]);
      setWorkouts(workoutsData || []);
      setWorkoutPlans(plansData || []);
      setError(null);
    } catch (err) {
      setError('Unable to load workouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkoutsData();
    const fetchTargets = async () => {
      const list = await getTargetUsers();
      setTargetUsersList(list || []);
    };
    fetchTargets();
    window.addEventListener('mockDataLoaded', loadWorkoutsData);
    window.addEventListener('profileUpdated', loadWorkoutsData);
    window.addEventListener('roleUpdated', loadWorkoutsData);
    return () => {
      window.removeEventListener('mockDataLoaded', loadWorkoutsData);
      window.removeEventListener('profileUpdated', loadWorkoutsData);
      window.removeEventListener('roleUpdated', loadWorkoutsData);
    };
  }, []);

  const normRole = (role || '').toUpperCase();
  const isTrainer = normRole.includes('TRAINER');
  const isNutritionist = normRole.includes('NUTRITIONIST');
  const isAdmin = normRole.includes('ADMIN');

  const handleAddExercise = (e) => {
    e.preventDefault();
    if (isNutritionist) {
      alert('Nutritionists cannot create or manage exercises');
      return;
    }
    if (!exName.trim() || !exSets || !exReps || !exWeight) {
      alert('Please fill all exercise fields');
      return;
    }
    const newEx = {
      id: Date.now(),
      sets: Number(exSets),
      reps: Number(exReps),
      weight: Number(exWeight),
      exercise: {
        name: exName,
        category: exCategory,
        muscleGroups: 'General',
        equipment: 'None',
        instructions: 'Logged via workout tracker',
        difficultyLevel: 'Medium'
      }
    };
    setExercises([...exercises, newEx]);
    setExName('');
    setExSets('');
    setExReps('');
    setExWeight('');
  };

  const handleRemoveExercise = (tempId) => {
    setExercises(exercises.filter(ex => ex.id !== tempId));
  };

  const handleSubmitWorkout = async (e) => {
    e.preventDefault();
    if (isNutritionist) {
      alert('Nutritionists do not have permission to create or manage workouts per system policy.');
      return;
    }
    if (!duration) {
      alert('Please enter workout duration');
      return;
    }

    const cleanedExercises = exercises.map(ex => ({
      sets: ex.sets,
      reps: ex.reps,
      weight: ex.weight,
      exercise: {
        name: ex.exercise.name,
        category: ex.exercise.category,
        muscleGroups: ex.exercise.muscleGroups,
        equipment: ex.exercise.equipment,
        instructions: ex.exercise.instructions,
        difficultyLevel: ex.exercise.difficultyLevel
      }
    }));

    const workoutPayload = {
      date,
      duration: Number(duration),
      notes,
      exercises: cleanedExercises,
      targetUserId
    };

    try {
      await createWorkout(workoutPayload);
      alert('Workout session logged successfully!');
      
      setDate(new Date().toISOString().split('T')[0]);
      setDuration('');
      setNotes('');
      setExercises([]);
      loadWorkoutsData();
    } catch (err) {
      alert('Failed to log workout');
    }
  };

  const handleAddPlanExercise = (e) => {
    e.preventDefault();
    if (!pExName.trim() || !pSets || !pReps) {
      alert('Exercise Name, Sets, and Repetitions are required');
      return;
    }
    const newEx = {
      id: Date.now(),
      exerciseName: pExName,
      sets: Number(pSets),
      repetitions: Number(pReps),
      duration: Number(pDuration || 15),
      restTime: Number(pRestTime || 60),
      notes: pNotes || ''
    };
    setPlanExercises([...planExercises, newEx]);
    setPExName('');
    setPSets('');
    setPReps('');
    setPDuration('');
    setPRestTime('');
    setPNotes('');
  };

  const handleCreateWorkoutPlan = async (e) => {
    e.preventDefault();
    if (!planName.trim()) {
      alert('Workout Plan Name is required');
      return;
    }

    const planPayload = {
      userId: planTargetUserId ? Number(planTargetUserId) : undefined,
      name: planName,
      goal: planGoal || 'General Fitness',
      description: planDescription,
      startDate: new Date().toISOString().split('T')[0],
      exercises: planExercises
    };

    try {
      await createWorkoutPlan(planPayload);
      alert('User-Specific Workout Plan created successfully!');
      setPlanName('');
      setPlanGoal('');
      setPlanDescription('');
      setPlanExercises([]);
      setShowPlanCreator(false);
      loadWorkoutsData();
    } catch (err) {
      alert('Failed to create workout plan');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div className="app-header">
        <div>
          <h1 className="page-title">Workouts & Exercise Management</h1>
          <p style={{ fontSize: '14px', color: '#6B5E5B', marginTop: '4px' }}>
            {isNutritionist
              ? 'View workout logs, training plans, and exercise session history.'
              : 'Review certified trainer workout plans and log individual workout sessions.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {(isTrainer || isAdmin) && (
            <button 
              className="btn btn-primary" 
              onClick={() => setShowPlanCreator(!showPlanCreator)}
              style={{ fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> {showPlanCreator ? 'Close Plan Form' : 'Assign Workout Plan to Client'}
            </button>
          )}
          <span className={`tag ${isNutritionist ? 'tag-paused' : 'tag-active'}`} style={{ fontSize: '12.8px', padding: '6.4px 12.8px' }}>
            {isNutritionist ? 'Nutritionist View (Read Only)' : `${role} Access`}
          </span>
        </div>
      </div>

      {isNutritionist && (
        <div className="alert alert-info" style={{ backgroundColor: '#FEF9E7', borderColor: '#F1C40F', color: '#7D6608', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={16} /> <strong>Role Access Notice:</strong> As a <strong>Nutritionist</strong>, you can view fitness workouts and exercise history, but creating or managing workouts and workout plans is restricted according to the platform access policy.
        </div>
      )}

      {/* Creator Form for Trainer / Admin */}
      {showPlanCreator && (isTrainer || isAdmin) && (
        <div className="content-card" style={{ borderTop: '4px solid #3B82F6', backgroundColor: '#EFF6FF' }}>
          <h3 className="card-title" style={{ color: '#1E40AF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Dumbbell size={20} color="#3B82F6" /> Create User-Specific Workout Plan
          </h3>

          <form onSubmit={handleCreateWorkoutPlan}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ color: '#1E40AF', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={14} color="#1E40AF" /> Select Client Member (Target User)
              </label>
              <select
                className="form-control"
                value={planTargetUserId}
                onChange={(e) => setPlanTargetUserId(e.target.value)}
                style={{ borderColor: '#93C5FD', backgroundColor: '#FFFFFF', fontWeight: '700' }}
                required
              >
                <option value="">-- Choose Client User --</option>
                {targetUsersList.map(u => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Workout Plan Name</label>
                <input
                  type="text"
                  placeholder="e.g. 4-Week Hypertrophy & Strength Split"
                  className="form-control"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Training Goal</label>
                <input
                  type="text"
                  placeholder="e.g. Hypertrophy / Muscle Endurance"
                  className="form-control"
                  value={planGoal}
                  onChange={(e) => setPlanGoal(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description / Instructions</label>
              <textarea
                placeholder="Targeted progressive overload program instructions..."
                className="form-control"
                style={{ minHeight: '60px' }}
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
              />
            </div>

            {/* Planned Exercises Input Section */}
            <div style={{ marginTop: '16px', backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid #93C5FD' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1E40AF', marginBottom: '12px' }}>
                Add Prescribed Exercises to Routine
              </h4>

              {planExercises.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  {planExercises.map((pe, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', backgroundColor: '#EFF6FF', borderRadius: '6px', marginBottom: '6px', fontSize: '13px' }}>
                      <span><strong>{pe.exerciseName}</strong> - {pe.sets} sets x {pe.repetitions} reps ({pe.duration}m, rest {pe.restTime}s) {pe.notes && `[Note: ${pe.notes}]`}</span>
                      <button type="button" onClick={() => setPlanExercises(planExercises.filter((_, i) => i !== idx))} style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}>Remove</button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 2fr auto', gap: '8px', alignItems: 'center' }}>
                <input type="text" placeholder="Exercise Name" className="form-control" value={pExName} onChange={(e) => setPExName(e.target.value)} />
                <input type="number" placeholder="Sets" className="form-control" value={pSets} onChange={(e) => setPSets(e.target.value)} />
                <input type="number" placeholder="Reps" className="form-control" value={pReps} onChange={(e) => setPReps(e.target.value)} />
                <input type="number" placeholder="Dur (m)" className="form-control" value={pDuration} onChange={(e) => setPDuration(e.target.value)} />
                <input type="number" placeholder="Rest (s)" className="form-control" value={pRestTime} onChange={(e) => setPRestTime(e.target.value)} />
                <input type="text" placeholder="Coaching Notes" className="form-control" value={pNotes} onChange={(e) => setPNotes(e.target.value)} />
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddPlanExercise}>+ Add</button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '16px', backgroundColor: '#2563EB', borderColor: '#2563EB' }}>
              Save & Assign Workout Plan to Client
            </button>
          </form>
        </div>
      )}

      {/* 1. Assigned Workout Plans Prominent Display Section */}
      {workoutPlans.length > 0 && (
        <div className="content-card" style={{ borderTop: '4px solid #3B82F6', marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 className="card-title" style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Dumbbell size={20} color="#3B82F6" /> Assigned Workout & Training Plans
            </h2>
            <span className="tag tag-active" style={{ fontSize: '12px', padding: '4px 10px' }}>
              {workoutPlans.length} Active Plan{workoutPlans.length > 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {workoutPlans.map(plan => (
              <div key={plan.id} style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#111827', margin: 0 }}>{plan.name}</h3>
                    <p style={{ fontSize: '13px', color: '#4B5563', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Target size={13} color="#3B82F6" /> Goal: <strong>{plan.goal || 'General Fitness'}</strong>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Dumbbell size={13} color="#3B82F6" /> Prescribed Exercises: <strong>{plan.exercises ? plan.exercises.length : 0} Routines</strong>
                      </span>
                    </p>
                  </div>
                  <span className="tag tag-active" style={{ fontSize: '11px', padding: '3px 8px' }}>{plan.status || 'ACTIVE'}</span>
                </div>

                {plan.description && (
                  <div style={{ fontSize: '13px', color: '#4B5563', fontStyle: 'italic', margin: '8px 0' }}>
                    "{plan.description}"
                  </div>
                )}

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '13px', color: '#1E40AF', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', padding: '4px 10px', borderRadius: '6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <User size={14} color="#1E40AF" /> Assigned Client Member: <strong>{plan.userName || (plan.user && plan.user.username) || 'Client User'}</strong>
                  </div>
                  {plan.trainerName && (
                    <div style={{ fontSize: '12px', color: '#2563EB', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Assigned by Certified Trainer: {plan.trainerName}
                    </div>
                  )}
                </div>
                  {plan.status !== 'COMPLETED' && !isNutritionist && (
                    <button 
                      onClick={() => handleCompleteWorkout(plan)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '12px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#DBEAFE', color: '#1E40AF', border: '1px solid #93C5FD', fontWeight: '700' }}
                    >
                      <CheckCircle size={14} /> Mark Workout Routine Completed
                    </button>
                  )}

                {/* Prescribed Exercises Table */}
                {plan.exercises && plan.exercises.length > 0 && (
                  <div style={{ marginTop: '12px', borderTop: '1px solid #E5E7EB', paddingTop: '12px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#374151', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Prescribed Exercise Routines & Targets
                    </h4>
                    <div className="responsive-table-container">
                      <table className="table" style={{ margin: 0, fontSize: '13px' }}>
                        <thead>
                          <tr>
                            <th>Exercise Name</th>
                            <th>Sets</th>
                            <th>Repetitions</th>
                            <th>Duration</th>
                            <th>Rest Interval</th>
                            <th>Trainer Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {plan.exercises.map((ex, exIdx) => (
                            <tr key={ex.id || exIdx}>
                              <td style={{ fontWeight: '600' }}>{ex.exerciseName || (ex.exercise ? ex.exercise.name : 'Exercise')}</td>
                              <td>{ex.sets || '-'}</td>
                              <td>{ex.repetitions || '-'}</td>
                              <td>{ex.duration ? `${ex.duration} mins` : '-'}</td>
                              <td>{ex.restTime ? `${ex.restTime}s` : '-'}</td>
                              <td style={{ fontStyle: 'italic', color: '#6B5E5B' }}>{ex.notes || 'None'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Workout Sessions Grid */}
      <div className={isNutritionist ? 'content-card' : 'dashboard-grid'}>
        {/* Left Column: Workouts List */}
        <div style={{ width: '100%' }}>
          <div className="content-card" style={isNutritionist ? { border: 'none', padding: 0 } : {}}>
            <h2 className="card-title" style={{ marginBottom: '24px' }}>Workout Session History</h2>

            {(isTrainer || isAdmin) && (
              <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #93C5FD', borderRadius: '8px', padding: '14px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1E40AF', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={15} color="#1E40AF" /> Inspect Client Workout Log
                    </h4>
                    <p style={{ fontSize: '12px', color: '#3B82F6', margin: '2px 0 0 0' }}>
                      Select a specific client to filter their recorded workout sessions and exercise reps.
                    </p>
                  </div>
                  <select
                    className="form-control"
                    value={targetUserId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTargetUserId(val);
                      loadWorkoutsData(val);
                    }}
                    style={{ width: 'auto', minWidth: '220px', fontWeight: '700', borderColor: '#93C5FD', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="">All Clients / Current Account</option>
                    {targetUsersList.map(u => (
                      <option key={u.id} value={u.id}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {loading ? (
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : workouts.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24">
                  <path d="M20.57 14.86L22 13.43l-2.83-2.83-.88.88-2.68-2.68.88-.88L13.66 5 12.22 6.44l1.42 1.42-7.78 7.78-1.42-1.42L3 15.64l2.83 2.83.88-.88 2.68 2.68-.88.88L10.34 20l1.42-1.42-1.42-1.42 7.78-7.78 1.42 1.42z" />
                </svg>
                <div className="empty-title">No workout sessions logged yet</div>
                <div className="empty-subtitle">
                  {isNutritionist ? 'No workout records available to display.' : 'Log your workouts on the right to track your session history.'}
                </div>
              </div>
            ) : (
              <div className="workout-list">
                {workouts.map((workout) => (
                  <div key={workout.id} className="workout-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span className="item-title" style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
                            {workout.name || workout.workoutType || 'Workout Session'}
                          </span>
                          <span className="tag tag-active" style={{ fontSize: '11px', padding: '3px 8px', textTransform: 'uppercase' }}>
                            {workout.workoutType || 'GENERAL'}
                          </span>
                        </div>
                        <span className="item-details" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', marginTop: '4px', fontSize: '13px', color: '#4B5563' }}>
                          <span><strong>Client:</strong> <span style={{ color: '#1E40AF', fontWeight: '700' }}>{workout.userName || (workout.user && workout.user.username) || 'Client Member'}</span></span>
                          <span><strong>Date:</strong> {workout.date ? String(workout.date).split('T')[0] : '-'}</span>
                          <span><strong>Duration:</strong> {workout.duration} mins</span>
                          {workout.caloriesBurned && (
                            <span style={{ color: '#DC2626', fontWeight: '700' }}>🔥 {workout.caloriesBurned} kcal</span>
                          )}
                        </span>
                      </div>
                      {workout.notes && (
                        <div style={{ fontSize: '13px', fontStyle: 'italic', color: '#4B5563', backgroundColor: '#F9FAFB', padding: '6px 12px', borderRadius: '6px', border: '1px solid #F3F4F6', maxWidth: '320px' }}>
                          <strong>Note:</strong> {workout.notes}
                        </div>
                      )}
                    </div>

                    {workout.exercises && workout.exercises.length > 0 && (
                      <div style={{ marginTop: '8px', borderTop: '1px solid #DCD2CE', paddingTop: '8px' }}>
                        <h4 style={{ fontSize: '13.6px', fontWeight: 600, textTransform: 'uppercase', color: '#6B5E5B', marginBottom: '8px' }}>
                          Completed Exercises
                        </h4>
                        <div className="responsive-table-container">
                          <table className="table" style={{ marginTop: 0 }}>
                            <thead>
                              <tr>
                                <th>Exercise</th>
                                <th>Category</th>
                                <th>Sets</th>
                                <th>Reps</th>
                                <th>Weight</th>
                              </tr>
                            </thead>
                            <tbody>
                              {workout.exercises.map((ex) => (
                                <tr key={ex.id}>
                                  <td style={{ fontWeight: '500' }}>{ex.exercise ? ex.exercise.name : 'Exercise'}</td>
                                  <td>{ex.exercise ? ex.exercise.category : 'General'}</td>
                                  <td>{ex.sets}</td>
                                  <td>{ex.reps}</td>
                                  <td>{ex.weight} kg</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Workout Logger Form (Hidden for Nutritionist) */}
        {!isNutritionist && (
          <div>
            <div className="content-card">
              <h3 className="card-title" style={{ marginBottom: '24px' }}>Log Workout Session</h3>
              
              <form onSubmit={handleSubmitWorkout}>
                {(isTrainer || isAdmin) && (
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label" style={{ color: '#DC2626', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={14} color="#DC2626" /> Select Client / Target User
                    </label>
                    <select
                      className="form-control"
                      value={targetUserId}
                      onChange={(e) => setTargetUserId(e.target.value)}
                      style={{ borderColor: '#FCA5A5', backgroundColor: '#FEF2F2', fontWeight: '700' }}
                    >
                      <option value="">Self (Current Account)</option>
                      {targetUsersList.map(u => (
                        <option key={u.id} value={u.id}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    placeholder="e.g. 45"
                    className="form-control"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    placeholder="How did you feel? Focus areas..."
                    className="form-control"
                    style={{ resize: 'vertical', minHeight: '80px' }}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* Exercises section inside Workout logger */}
                <div style={{ marginTop: '24px', marginBottom: '24px', borderTop: '1px solid #DCD2CE', paddingTop: '24px' }}>
                  <h4 style={{ fontSize: '15.2px', fontWeight: 600, marginBottom: '16px' }}>Exercises Completed</h4>

                  {exercises.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      {exercises.map((ex) => (
                        <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', border: '1px solid #DCD2CE', borderRadius: '4px', marginBottom: '8px', backgroundColor: '#FAF8F7', fontSize: '13.6px' }}>
                          <span>
                            <strong>{ex.exercise.name}</strong> - {ex.sets} sets x {ex.reps} reps ({ex.weight}kg)
                          </span>
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveExercise(ex.id)} style={{ padding: '3.2px 8px' }}>
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Exercise form row */}
                  <div style={{ backgroundColor: '#FAF8F7', padding: '16px', borderRadius: '6px', border: '1px solid #DCD2CE', marginBottom: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Exercise Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Bench Press"
                        className="form-control"
                        value={exName}
                        onChange={(e) => setExName(e.target.value)}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Sets</label>
                        <input
                          type="number"
                          placeholder="3"
                          className="form-control"
                          value={exSets}
                          onChange={(e) => setExSets(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Reps</label>
                        <input
                          type="number"
                          placeholder="10"
                          className="form-control"
                          value={exReps}
                          onChange={(e) => setExReps(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Weight (kg)</label>
                        <input
                          type="number"
                          placeholder="60"
                          className="form-control"
                          value={exWeight}
                          onChange={(e) => setExWeight(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                          className="form-control"
                          value={exCategory}
                          onChange={(e) => setExCategory(e.target.value)}
                        >
                          <option value="Strength">Strength</option>
                          <option value="Cardio">Cardio</option>
                          <option value="Flexibility">Flexibility</option>
                        </select>
                      </div>
                    </div>

                    <button type="button" className="btn btn-secondary btn-sm btn-block" onClick={handleAddExercise}>
                      Add Exercise to Workout
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Log Workout Session
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutsPage;

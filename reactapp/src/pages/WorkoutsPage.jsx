import React, { useState, useEffect } from 'react';
import { getUserWorkouts, createWorkout } from '../api';

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form States
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState([]);
  
  // Exercise Input States
  const [exName, setExName] = useState('');
  const [exCategory, setExCategory] = useState('Strength');
  const [exSets, setExSets] = useState('');
  const [exReps, setExReps] = useState('');
  const [exWeight, setExWeight] = useState('');

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const data = await getUserWorkouts();
      setWorkouts(data || []);
      setError(null);
    } catch (err) {
      setError('Unable to load workouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const handleAddExercise = (e) => {
    e.preventDefault();
    if (!exName.trim() || !exSets || !exReps || !exWeight) {
      alert('Please fill all exercise fields');
      return;
    }
    const newEx = {
      id: Date.now(), // temporary ID
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
    if (!duration) {
      alert('Please enter workout duration');
      return;
    }

    // Clean up temporary IDs from exercises before sending
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
      exercises: cleanedExercises
    };

    try {
      await createWorkout(workoutPayload);
      alert('Workout logged successfully!');
      
      // Reset state
      setDate(new Date().toISOString().split('T')[0]);
      setDuration('');
      setNotes('');
      setExercises([]);
      loadWorkouts();
    } catch (err) {
      // In case of transient entity issues, try saving workout without exercises
      if (cleanedExercises.length > 0) {
        const retry = window.confirm('Failed to log workout with exercises due to database constraints. Would you like to log the workout duration and notes only?');
        if (retry) {
          try {
            await createWorkout({
              date,
              duration: Number(duration),
              notes,
              exercises: []
            });
            alert('Workout logged (duration & notes only)!');
            setDate(new Date().toISOString().split('T')[0]);
            setDuration('');
            setNotes('');
            setExercises([]);
            loadWorkouts();
            return;
          } catch (retryErr) {
            alert('Failed to log workout');
          }
        }
      } else {
        alert('Failed to log workout');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="app-header">
        <h1 className="page-title">Workouts</h1>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Workouts List */}
        <div>
          <div className="content-card">
            <h2 className="card-title" style={{ marginBottom: '24px' }}>Workout History</h2>

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
                <div className="empty-title">No workouts logged yet</div>
                <div className="empty-subtitle">Log your workouts on the right to track your session history.</div>
              </div>
            ) : (
              <div className="workout-list">
                {workouts.map((workout) => (
                  <div key={workout.id} className="workout-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span className="item-title" style={{ fontSize: '17.6px' }}>
                          Workout Session
                        </span>
                        <span className="item-details" style={{ display: 'block', marginTop: '3.2px' }}>
                          Date: {workout.date} | Duration: {workout.duration} minutes
                        </span>
                      </div>
                      {workout.notes && (
                        <div style={{ fontSize: '13.6px', fontStyle: 'italic', color: '#6B5E5B', maxWidth: '300px', textAlign: 'right' }}>
                          Note: {workout.notes}
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

        {/* Right Column: Workout Logger Form */}
        <div>
          <div className="content-card">
            <h3 className="card-title" style={{ marginBottom: '24px' }}>Log Workout</h3>
            
            <form onSubmit={handleSubmitWorkout}>
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
      </div>
    </div>
  );
};

export default WorkoutsPage;

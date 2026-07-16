package com.examly.springapp.service;

import com.examly.springapp.entity.Workout;
import com.examly.springapp.entity.WorkoutExercise;
import java.util.List;

public interface WorkoutService {
    Workout createWorkout(Workout workout);
    List<Workout> getWorkoutsByUserId(Long userId);
    List<WorkoutExercise> getExercisesByWorkoutId(Long workoutId);
}

package com.examly.springapp.service;
import com.examly.springapp.entity.Workout;
import com.examly.springapp.entity.WorkoutExercise;
import com.examly.springapp.repository.WorkoutRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WorkoutService {
    @Autowired
    private WorkoutRepository workoutRepository;

    public Workout createWorkout(Workout workout) {
        return workoutRepository.save(workout);
    }
    
    public List<Workout> getWorkoutsByUserId(Long userId) {
        return workoutRepository.findByUserId(userId);
    }
    
    public List<WorkoutExercise> getExercisesByWorkoutId(Long workoutId) {
        Workout workout = workoutRepository.findById(workoutId).orElse(null);
        return workout != null ? workout.getExercises() : null;
    }
}

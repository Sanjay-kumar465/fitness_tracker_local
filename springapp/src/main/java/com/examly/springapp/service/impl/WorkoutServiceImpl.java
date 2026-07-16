package com.examly.springapp.service.impl;

import com.examly.springapp.entity.Workout;
import com.examly.springapp.entity.WorkoutExercise;
import com.examly.springapp.repository.WorkoutRepository;
import com.examly.springapp.service.WorkoutService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkoutServiceImpl implements WorkoutService {

    private final WorkoutRepository workoutRepository;

    public WorkoutServiceImpl(WorkoutRepository workoutRepository) {
        this.workoutRepository = workoutRepository;
    }

    @Override
    public Workout createWorkout(Workout workout) {
        return workoutRepository.save(workout);
    }

    @Override
    public List<Workout> getWorkoutsByUserId(Long userId) {
        return workoutRepository.findByUserId(userId);
    }

    @Override
    public List<WorkoutExercise> getExercisesByWorkoutId(Long workoutId) {
        Workout workout = workoutRepository.findById(workoutId).orElse(null);
        return workout != null ? workout.getExercises() : null;
    }
}

package com.examly.springapp.service.impl;

import com.examly.springapp.entity.User;
import com.examly.springapp.entity.Workout;
import com.examly.springapp.entity.WorkoutExercise;
import com.examly.springapp.enums.Role;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.WorkoutRepository;
import com.examly.springapp.service.WorkoutService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkoutServiceImpl implements WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserRepository userRepository;

    public WorkoutServiceImpl(WorkoutRepository workoutRepository, UserRepository userRepository) {
        this.workoutRepository = workoutRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Workout createWorkout(Workout workout) {
        if (workout.getUser() != null && workout.getUser().getId() != null) {
            User targetUser = userRepository.findById(workout.getUser().getId()).orElse(null);
            if (targetUser != null && (targetUser.getRole() == Role.TRAINER || targetUser.getRole() == Role.NUTRITIONIST || targetUser.getRole() == Role.ADMIN)) {
                throw new IllegalArgumentException("Workouts can only be assigned to standard or premium client users, not staff roles.");
            }
        }
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

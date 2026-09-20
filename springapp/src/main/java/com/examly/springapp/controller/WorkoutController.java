package com.examly.springapp.controller;

import com.examly.springapp.entity.Workout;
import com.examly.springapp.entity.WorkoutExercise;
import com.examly.springapp.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    @PostMapping
    @PreAuthorize("hasAnyRole('STANDARD_USER', 'USER', 'PREMIUM_USER', 'TRAINER', 'ADMIN')")
    public ResponseEntity<Workout> createWorkout(@RequestBody Workout workout) {
        return ResponseEntity.ok(workoutService.createWorkout(workout));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Workout>> getUserWorkouts(@PathVariable Long userId) {
        return ResponseEntity.ok(workoutService.getWorkoutsByUserId(userId));
    }

    @GetMapping("/{workoutId}/exercises")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WorkoutExercise>> getWorkoutExercises(@PathVariable Long workoutId) {
        return ResponseEntity.ok(workoutService.getExercisesByWorkoutId(workoutId));
    }
}

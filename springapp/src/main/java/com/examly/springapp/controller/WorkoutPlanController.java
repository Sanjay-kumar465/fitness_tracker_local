package com.examly.springapp.controller;

import com.examly.springapp.dto.WorkoutPlanDto;
import com.examly.springapp.dto.WorkoutPlanExerciseDto;
import com.examly.springapp.entity.User;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.WorkoutPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workout-plans")
@Tag(name = "Workout Plans", description = "APIs for Trainer user-specific workout plan management")
public class WorkoutPlanController {

    private final WorkoutPlanService workoutPlanService;
    private final UserRepository userRepository;

    public WorkoutPlanController(WorkoutPlanService workoutPlanService, UserRepository userRepository) {
        this.workoutPlanService = workoutPlanService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    @Operation(summary = "Create a workout plan for a specific target user")
    public ResponseEntity<WorkoutPlanDto> createWorkoutPlan(@RequestBody WorkoutPlanDto dto, Authentication authentication) {
        WorkoutPlanDto created = workoutPlanService.createWorkoutPlan(dto, authentication.getName());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @Operation(summary = "Get assigned workout plans for the authenticated user")
    public ResponseEntity<List<WorkoutPlanDto>> getMyWorkoutPlans(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<WorkoutPlanDto> plans = workoutPlanService.getWorkoutPlansForUser(user.getId());
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get workout plans for a target user")
    public ResponseEntity<?> getWorkoutPlansByUser(@PathVariable Long userId, Authentication authentication) {
        User authUser = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        boolean isOwner = authUser.getId().equals(userId);
        boolean isStaff = authentication.getAuthorities().stream().anyMatch(a ->
                a.getAuthority().equals("ROLE_TRAINER") || a.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isStaff) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied to target user's workout plans");
        }

        List<WorkoutPlanDto> plans = workoutPlanService.getWorkoutPlansForUser(userId);
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get workout plan details by ID")
    public ResponseEntity<?> getWorkoutPlanById(@PathVariable Long id, Authentication authentication) {
        User authUser = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        WorkoutPlanDto plan = workoutPlanService.getWorkoutPlanById(id);
        boolean isOwner = authUser.getId().equals(plan.getUserId());
        boolean isStaff = authentication.getAuthorities().stream().anyMatch(a ->
                a.getAuthority().equals("ROLE_TRAINER") || a.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isStaff) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied to this workout plan");
        }

        return ResponseEntity.ok(plan);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    @Operation(summary = "Update an existing workout plan")
    public ResponseEntity<WorkoutPlanDto> updateWorkoutPlan(@PathVariable Long id, @RequestBody WorkoutPlanDto dto) {
        WorkoutPlanDto updated = workoutPlanService.updateWorkoutPlan(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    @Operation(summary = "Delete a workout plan")
    public ResponseEntity<Void> deleteWorkoutPlan(@PathVariable Long id) {
        workoutPlanService.deleteWorkoutPlan(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/exercises")
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    @Operation(summary = "Add an exercise to a workout plan")
    public ResponseEntity<WorkoutPlanDto> addExerciseToWorkoutPlan(@PathVariable Long id, @RequestBody WorkoutPlanExerciseDto exDto) {
        WorkoutPlanDto updated = workoutPlanService.addExerciseToWorkoutPlan(id, exDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(updated);
    }

    @DeleteMapping("/{id}/exercises/{exerciseId}")
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    @Operation(summary = "Delete an exercise from a workout plan")
    public ResponseEntity<Void> deleteExerciseFromWorkoutPlan(@PathVariable Long id, @PathVariable Long exerciseId) {
        workoutPlanService.deleteExerciseFromWorkoutPlan(exerciseId);
        return ResponseEntity.noContent().build();
    }
}

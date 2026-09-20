package com.examly.springapp.service;

import com.examly.springapp.dto.WorkoutPlanDto;
import com.examly.springapp.dto.WorkoutPlanExerciseDto;
import com.examly.springapp.entity.Exercise;
import com.examly.springapp.entity.User;
import com.examly.springapp.entity.WorkoutPlan;
import com.examly.springapp.entity.WorkoutPlanExercise;
import com.examly.springapp.repository.ExerciseRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.WorkoutPlanExerciseRepository;
import com.examly.springapp.repository.WorkoutPlanRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutPlanService {

    private final WorkoutPlanRepository workoutPlanRepository;
    private final WorkoutPlanExerciseRepository workoutPlanExerciseRepository;
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;

    public WorkoutPlanService(WorkoutPlanRepository workoutPlanRepository,
                              WorkoutPlanExerciseRepository workoutPlanExerciseRepository,
                              UserRepository userRepository,
                              ExerciseRepository exerciseRepository) {
        this.workoutPlanRepository = workoutPlanRepository;
        this.workoutPlanExerciseRepository = workoutPlanExerciseRepository;
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
    }

    public WorkoutPlanDto createWorkoutPlan(WorkoutPlanDto dto, String authenticatedUsername) {
        User creator = userRepository.findByUsername(authenticatedUsername)
                .orElseThrow(() -> new IllegalArgumentException("Creator user not found"));

        Long targetUserId = dto.getUserId() != null ? dto.getUserId() : creator.getId();
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("Target user not found with ID: " + targetUserId));
        if (targetUser.getRole() == com.examly.springapp.enums.Role.TRAINER ||
            targetUser.getRole() == com.examly.springapp.enums.Role.NUTRITIONIST ||
            targetUser.getRole() == com.examly.springapp.enums.Role.ADMIN) {
            throw new IllegalArgumentException("Workout plans can only be assigned to standard or premium client users, not staff roles.");
        }

        WorkoutPlan plan = new WorkoutPlan();
        plan.setUser(targetUser);
        plan.setTrainer(creator);
        plan.setName(dto.getName() != null ? dto.getName() : "Custom Workout Plan");
        plan.setDescription(dto.getDescription());
        plan.setGoal(dto.getGoal());
        plan.setStartDate(dto.getStartDate());
        plan.setEndDate(dto.getEndDate());
        plan.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");

        if (dto.getExercises() != null && !dto.getExercises().isEmpty()) {
            List<WorkoutPlanExercise> exercises = new ArrayList<>();
            for (WorkoutPlanExerciseDto exDto : dto.getExercises()) {
                if (exDto.getSets() != null && exDto.getSets() <= 0) {
                    throw new IllegalArgumentException("Sets must be greater than 0");
                }
                if (exDto.getRepetitions() != null && exDto.getRepetitions() <= 0) {
                    throw new IllegalArgumentException("Repetitions must be greater than 0");
                }
                WorkoutPlanExercise wpe = new WorkoutPlanExercise();
                wpe.setWorkoutPlan(plan);
                wpe.setExerciseName(exDto.getExerciseName());
                wpe.setSets(exDto.getSets());
                wpe.setRepetitions(exDto.getRepetitions());
                wpe.setDuration(exDto.getDuration());
                wpe.setRestTime(exDto.getRestTime());
                wpe.setNotes(exDto.getNotes());

                if (exDto.getExerciseId() != null) {
                    exerciseRepository.findById(exDto.getExerciseId()).ifPresent(wpe::setExercise);
                }
                exercises.add(wpe);
            }
            plan.setExercises(exercises);
        }

        WorkoutPlan saved = workoutPlanRepository.save(plan);
        return mapToDto(saved);
    }

    public List<WorkoutPlanDto> getWorkoutPlansForUser(Long userId) {
        return workoutPlanRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<WorkoutPlanDto> getWorkoutPlansByTrainer(Long trainerId) {
        return workoutPlanRepository.findByTrainerId(trainerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public WorkoutPlanDto getWorkoutPlanById(Long id) {
        WorkoutPlan plan = workoutPlanRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Workout plan not found with ID: " + id));
        return mapToDto(plan);
    }

    public WorkoutPlanDto updateWorkoutPlan(Long id, WorkoutPlanDto dto) {
        WorkoutPlan plan = workoutPlanRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Workout plan not found with ID: " + id));

        if (dto.getName() != null) plan.setName(dto.getName());
        if (dto.getDescription() != null) plan.setDescription(dto.getDescription());
        if (dto.getGoal() != null) plan.setGoal(dto.getGoal());
        if (dto.getStartDate() != null) plan.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) plan.setEndDate(dto.getEndDate());
        if (dto.getStatus() != null) plan.setStatus(dto.getStatus());

        WorkoutPlan updated = workoutPlanRepository.save(plan);
        return mapToDto(updated);
    }

    public void deleteWorkoutPlan(Long id) {
        if (!workoutPlanRepository.existsById(id)) {
            throw new IllegalArgumentException("Workout plan not found with ID: " + id);
        }
        workoutPlanRepository.deleteById(id);
    }

    public WorkoutPlanDto addExerciseToWorkoutPlan(Long planId, WorkoutPlanExerciseDto exDto) {
        WorkoutPlan plan = workoutPlanRepository.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("Workout plan not found with ID: " + planId));

        if (exDto.getSets() != null && exDto.getSets() <= 0) {
            throw new IllegalArgumentException("Sets must be greater than 0");
        }
        if (exDto.getRepetitions() != null && exDto.getRepetitions() <= 0) {
            throw new IllegalArgumentException("Repetitions must be greater than 0");
        }

        WorkoutPlanExercise wpe = new WorkoutPlanExercise();
        wpe.setWorkoutPlan(plan);
        wpe.setExerciseName(exDto.getExerciseName());
        wpe.setSets(exDto.getSets());
        wpe.setRepetitions(exDto.getRepetitions());
        wpe.setDuration(exDto.getDuration());
        wpe.setRestTime(exDto.getRestTime());
        wpe.setNotes(exDto.getNotes());

        if (exDto.getExerciseId() != null) {
            exerciseRepository.findById(exDto.getExerciseId()).ifPresent(wpe::setExercise);
        }

        workoutPlanExerciseRepository.save(wpe);
        return mapToDto(workoutPlanRepository.findById(planId).get());
    }

    public void deleteExerciseFromWorkoutPlan(Long exerciseId) {
        workoutPlanExerciseRepository.deleteById(exerciseId);
    }

    public WorkoutPlanDto mapToDto(WorkoutPlan plan) {
        WorkoutPlanDto dto = new WorkoutPlanDto();
        dto.setId(plan.getId());
        if (plan.getUser() != null) {
            dto.setUserId(plan.getUser().getId());
            dto.setUserName(plan.getUser().getUsername());
        }
        if (plan.getTrainer() != null) {
            dto.setTrainerId(plan.getTrainer().getId());
            dto.setTrainerName(plan.getTrainer().getUsername());
        }
        dto.setName(plan.getName());
        dto.setDescription(plan.getDescription());
        dto.setGoal(plan.getGoal());
        dto.setStartDate(plan.getStartDate());
        dto.setEndDate(plan.getEndDate());
        dto.setStatus(plan.getStatus());
        dto.setCreatedAt(plan.getCreatedAt());
        dto.setUpdatedAt(plan.getUpdatedAt());

        if (plan.getExercises() != null) {
            List<WorkoutPlanExerciseDto> exDtos = plan.getExercises().stream().map(ex -> {
                WorkoutPlanExerciseDto ed = new WorkoutPlanExerciseDto();
                ed.setId(ex.getId());
                if (ex.getExercise() != null) {
                    ed.setExerciseId(ex.getExercise().getId());
                    ed.setExerciseName(ex.getExercise().getName());
                } else {
                    ed.setExerciseName(ex.getExerciseName());
                }
                ed.setSets(ex.getSets());
                ed.setRepetitions(ex.getRepetitions());
                ed.setDuration(ex.getDuration());
                ed.setRestTime(ex.getRestTime());
                ed.setNotes(ex.getNotes());
                return ed;
            }).collect(Collectors.toList());
            dto.setExercises(exDtos);
        }
        return dto;
    }
}

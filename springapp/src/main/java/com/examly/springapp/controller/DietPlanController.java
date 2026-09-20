package com.examly.springapp.controller;

import com.examly.springapp.dto.DietPlanDto;
import com.examly.springapp.dto.DietPlanFoodDto;
import com.examly.springapp.entity.User;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.DietPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diet-plans")
@Tag(name = "Diet Plans", description = "APIs for Nutritionist user-specific diet plan management")
public class DietPlanController {

    private final DietPlanService dietPlanService;
    private final UserRepository userRepository;

    public DietPlanController(DietPlanService dietPlanService, UserRepository userRepository) {
        this.dietPlanService = dietPlanService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('NUTRITIONIST', 'ADMIN')")
    @Operation(summary = "Create a diet plan for a specific target user")
    public ResponseEntity<DietPlanDto> createDietPlan(@RequestBody DietPlanDto dto, Authentication authentication) {
        DietPlanDto created = dietPlanService.createDietPlan(dto, authentication.getName());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    @Operation(summary = "Get assigned diet plans for the authenticated user")
    public ResponseEntity<List<DietPlanDto>> getMyDietPlans(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<DietPlanDto> plans = dietPlanService.getDietPlansForUser(user.getId());
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get diet plans for a target user")
    public ResponseEntity<?> getDietPlansByUser(@PathVariable Long userId, Authentication authentication) {
        User authUser = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        boolean isOwner = authUser.getId().equals(userId);
        boolean isStaff = authentication.getAuthorities().stream().anyMatch(a ->
                a.getAuthority().equals("ROLE_NUTRITIONIST") || a.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isStaff) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied to target user's diet plans");
        }

        List<DietPlanDto> plans = dietPlanService.getDietPlansForUser(userId);
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get diet plan details by ID")
    public ResponseEntity<?> getDietPlanById(@PathVariable Long id, Authentication authentication) {
        User authUser = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        DietPlanDto plan = dietPlanService.getDietPlanById(id);
        boolean isOwner = authUser.getId().equals(plan.getUserId());
        boolean isStaff = authentication.getAuthorities().stream().anyMatch(a ->
                a.getAuthority().equals("ROLE_NUTRITIONIST") || a.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isStaff) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied to this diet plan");
        }

        return ResponseEntity.ok(plan);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('NUTRITIONIST', 'ADMIN')")
    @Operation(summary = "Update an existing diet plan")
    public ResponseEntity<DietPlanDto> updateDietPlan(@PathVariable Long id, @RequestBody DietPlanDto dto) {
        DietPlanDto updated = dietPlanService.updateDietPlan(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('NUTRITIONIST', 'ADMIN')")
    @Operation(summary = "Delete a diet plan")
    public ResponseEntity<Void> deleteDietPlan(@PathVariable Long id) {
        dietPlanService.deleteDietPlan(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/foods")
    @PreAuthorize("hasAnyRole('NUTRITIONIST', 'ADMIN')")
    @Operation(summary = "Add a food item to a diet plan")
    public ResponseEntity<DietPlanDto> addFoodToDietPlan(@PathVariable Long id, @RequestBody DietPlanFoodDto foodDto) {
        DietPlanDto updated = dietPlanService.addFoodToDietPlan(id, foodDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(updated);
    }

    @DeleteMapping("/{id}/foods/{foodId}")
    @PreAuthorize("hasAnyRole('NUTRITIONIST', 'ADMIN')")
    @Operation(summary = "Delete a food item from a diet plan")
    public ResponseEntity<Void> deleteFoodFromDietPlan(@PathVariable Long id, @PathVariable Long foodId) {
        dietPlanService.deleteFoodFromDietPlan(foodId);
        return ResponseEntity.noContent().build();
    }
}

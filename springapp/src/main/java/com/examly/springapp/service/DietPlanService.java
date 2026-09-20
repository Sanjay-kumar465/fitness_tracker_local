package com.examly.springapp.service;

import com.examly.springapp.dto.DietPlanDto;
import com.examly.springapp.dto.DietPlanFoodDto;
import com.examly.springapp.entity.DietPlan;
import com.examly.springapp.entity.DietPlanFood;
import com.examly.springapp.entity.User;
import com.examly.springapp.repository.DietPlanFoodRepository;
import com.examly.springapp.repository.DietPlanRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DietPlanService {

    private final DietPlanRepository dietPlanRepository;
    private final DietPlanFoodRepository dietPlanFoodRepository;
    private final UserRepository userRepository;

    public DietPlanService(DietPlanRepository dietPlanRepository,
                           DietPlanFoodRepository dietPlanFoodRepository,
                           UserRepository userRepository) {
        this.dietPlanRepository = dietPlanRepository;
        this.dietPlanFoodRepository = dietPlanFoodRepository;
        this.userRepository = userRepository;
    }

    public DietPlanDto createDietPlan(DietPlanDto dto, String authenticatedUsername) {
        User creator = userRepository.findByUsername(authenticatedUsername)
                .orElseThrow(() -> new IllegalArgumentException("Creator user not found"));

        Long targetUserId = dto.getUserId() != null ? dto.getUserId() : creator.getId();
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("Target user not found with ID: " + targetUserId));
        if (targetUser.getRole() == com.examly.springapp.enums.Role.TRAINER ||
            targetUser.getRole() == com.examly.springapp.enums.Role.NUTRITIONIST ||
            targetUser.getRole() == com.examly.springapp.enums.Role.ADMIN) {
            throw new IllegalArgumentException("Diet plans can only be assigned to standard or premium client users, not staff roles.");
        }

        if (dto.getDailyCalories() != null && dto.getDailyCalories() < 0) {
            throw new IllegalArgumentException("Daily calories cannot be negative");
        }

        DietPlan plan = new DietPlan();
        plan.setUser(targetUser);
        plan.setNutritionist(creator);
        plan.setPlanName(dto.getPlanName() != null ? dto.getPlanName() : "Custom Diet Plan");
        plan.setDescription(dto.getDescription());
        plan.setGoal(dto.getGoal());
        plan.setDailyCalories(dto.getDailyCalories() != null ? dto.getDailyCalories() : 2000.0);
        plan.setProteinTarget(dto.getProteinTarget() != null ? dto.getProteinTarget() : 150.0);
        plan.setCarbsTarget(dto.getCarbsTarget() != null ? dto.getCarbsTarget() : 200.0);
        plan.setFatTarget(dto.getFatTarget() != null ? dto.getFatTarget() : 70.0);
        plan.setStartDate(dto.getStartDate());
        plan.setEndDate(dto.getEndDate());
        plan.setStatus(dto.getStatus() != null ? dto.getStatus() : "ACTIVE");

        if (dto.getFoods() != null && !dto.getFoods().isEmpty()) {
            List<DietPlanFood> foods = new ArrayList<>();
            for (DietPlanFoodDto foodDto : dto.getFoods()) {
                DietPlanFood food = new DietPlanFood();
                food.setDietPlan(plan);
                food.setFoodName(foodDto.getFoodName());
                food.setMealType(foodDto.getMealType());
                food.setQuantity(foodDto.getQuantity());
                food.setCalories(foodDto.getCalories());
                food.setProtein(foodDto.getProtein());
                food.setCarbohydrates(foodDto.getCarbohydrates());
                food.setFats(foodDto.getFats());
                foods.add(food);
            }
            plan.setFoods(foods);
        }

        DietPlan saved = dietPlanRepository.save(plan);
        return mapToDto(saved);
    }

    public List<DietPlanDto> getDietPlansForUser(Long userId) {
        return dietPlanRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<DietPlanDto> getDietPlansByNutritionist(Long nutritionistId) {
        return dietPlanRepository.findByNutritionistId(nutritionistId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public DietPlanDto getDietPlanById(Long id) {
        DietPlan plan = dietPlanRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Diet plan not found with ID: " + id));
        return mapToDto(plan);
    }

    public DietPlanDto updateDietPlan(Long id, DietPlanDto dto) {
        DietPlan plan = dietPlanRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Diet plan not found with ID: " + id));

        if (dto.getPlanName() != null) plan.setPlanName(dto.getPlanName());
        if (dto.getDescription() != null) plan.setDescription(dto.getDescription());
        if (dto.getGoal() != null) plan.setGoal(dto.getGoal());
        if (dto.getDailyCalories() != null) plan.setDailyCalories(dto.getDailyCalories());
        if (dto.getProteinTarget() != null) plan.setProteinTarget(dto.getProteinTarget());
        if (dto.getCarbsTarget() != null) plan.setCarbsTarget(dto.getCarbsTarget());
        if (dto.getFatTarget() != null) plan.setFatTarget(dto.getFatTarget());
        if (dto.getStartDate() != null) plan.setStartDate(dto.getStartDate());
        if (dto.getEndDate() != null) plan.setEndDate(dto.getEndDate());
        if (dto.getStatus() != null) plan.setStatus(dto.getStatus());

        DietPlan updated = dietPlanRepository.save(plan);
        return mapToDto(updated);
    }

    public void deleteDietPlan(Long id) {
        if (!dietPlanRepository.existsById(id)) {
            throw new IllegalArgumentException("Diet plan not found with ID: " + id);
        }
        dietPlanRepository.deleteById(id);
    }

    public DietPlanDto addFoodToDietPlan(Long planId, DietPlanFoodDto foodDto) {
        DietPlan plan = dietPlanRepository.findById(planId)
                .orElseThrow(() -> new IllegalArgumentException("Diet plan not found with ID: " + planId));

        DietPlanFood food = new DietPlanFood();
        food.setDietPlan(plan);
        food.setFoodName(foodDto.getFoodName());
        food.setMealType(foodDto.getMealType());
        food.setQuantity(foodDto.getQuantity());
        food.setCalories(foodDto.getCalories());
        food.setProtein(foodDto.getProtein());
        food.setCarbohydrates(foodDto.getCarbohydrates());
        food.setFats(foodDto.getFats());

        dietPlanFoodRepository.save(food);
        return mapToDto(dietPlanRepository.findById(planId).get());
    }

    public void deleteFoodFromDietPlan(Long foodId) {
        dietPlanFoodRepository.deleteById(foodId);
    }

    public DietPlanDto mapToDto(DietPlan plan) {
        DietPlanDto dto = new DietPlanDto();
        dto.setId(plan.getId());
        if (plan.getUser() != null) {
            dto.setUserId(plan.getUser().getId());
            dto.setUserName(plan.getUser().getUsername());
        }
        if (plan.getNutritionist() != null) {
            dto.setNutritionistId(plan.getNutritionist().getId());
            dto.setNutritionistName(plan.getNutritionist().getUsername());
        }
        dto.setPlanName(plan.getPlanName());
        dto.setDescription(plan.getDescription());
        dto.setGoal(plan.getGoal());
        dto.setDailyCalories(plan.getDailyCalories());
        dto.setProteinTarget(plan.getProteinTarget());
        dto.setCarbsTarget(plan.getCarbsTarget());
        dto.setFatTarget(plan.getFatTarget());
        dto.setStartDate(plan.getStartDate());
        dto.setEndDate(plan.getEndDate());
        dto.setStatus(plan.getStatus());
        dto.setCreatedAt(plan.getCreatedAt());
        dto.setUpdatedAt(plan.getUpdatedAt());

        if (plan.getFoods() != null) {
            List<DietPlanFoodDto> foodDtos = plan.getFoods().stream().map(f -> {
                DietPlanFoodDto fd = new DietPlanFoodDto();
                fd.setId(f.getId());
                fd.setFoodName(f.getFoodName());
                fd.setMealType(f.getMealType());
                fd.setQuantity(f.getQuantity());
                fd.setCalories(f.getCalories());
                fd.setProtein(f.getProtein());
                fd.setCarbohydrates(f.getCarbohydrates());
                fd.setFats(f.getFats());
                return fd;
            }).collect(Collectors.toList());
            dto.setFoods(foodDtos);
        }
        return dto;
    }
}

package com.examly.springapp.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class DietPlanDto {
    private Long id;
    private Long userId;
    private String userName;
    private Long nutritionistId;
    private String nutritionistName;
    private String planName;
    private String description;
    private String goal;
    private Double dailyCalories;
    private Double proteinTarget;
    private Double carbsTarget;
    private Double fatTarget;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<DietPlanFoodDto> foods;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public Long getNutritionistId() { return nutritionistId; }
    public void setNutritionistId(Long nutritionistId) { this.nutritionistId = nutritionistId; }

    public String getNutritionistName() { return nutritionistName; }
    public void setNutritionistName(String nutritionistName) { this.nutritionistName = nutritionistName; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }

    public Double getDailyCalories() { return dailyCalories; }
    public void setDailyCalories(Double dailyCalories) { this.dailyCalories = dailyCalories; }

    public Double getProteinTarget() { return proteinTarget; }
    public void setProteinTarget(Double proteinTarget) { this.proteinTarget = proteinTarget; }

    public Double getCarbsTarget() { return carbsTarget; }
    public void setCarbsTarget(Double carbsTarget) { this.carbsTarget = carbsTarget; }

    public Double getFatTarget() { return fatTarget; }
    public void setFatTarget(Double fatTarget) { this.fatTarget = fatTarget; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<DietPlanFoodDto> getFoods() { return foods; }
    public void setFoods(List<DietPlanFoodDto> foods) { this.foods = foods; }
}

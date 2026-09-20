package com.examly.springapp.dto;

import com.examly.springapp.enums.MealType;

public class DietPlanFoodDto {
    private Long id;
    private String foodName;
    private MealType mealType;
    private Double quantity;
    private Double calories;
    private Double protein;
    private Double carbohydrates;
    private Double fats;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public MealType getMealType() { return mealType; }
    public void setMealType(MealType mealType) { this.mealType = mealType; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public Double getCalories() { return calories; }
    public void setCalories(Double calories) { this.calories = calories; }

    public Double getProtein() { return protein; }
    public void setProtein(Double protein) { this.protein = protein; }

    public Double getCarbohydrates() { return carbohydrates; }
    public void setCarbohydrates(Double carbohydrates) { this.carbohydrates = carbohydrates; }

    public Double getFats() { return fats; }
    public void setFats(Double fats) { this.fats = fats; }
}

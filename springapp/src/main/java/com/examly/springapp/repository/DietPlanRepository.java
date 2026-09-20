package com.examly.springapp.repository;

import com.examly.springapp.entity.DietPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DietPlanRepository extends JpaRepository<DietPlan, Long> {
    List<DietPlan> findByUserId(Long userId);
    List<DietPlan> findByNutritionistId(Long nutritionistId);
}

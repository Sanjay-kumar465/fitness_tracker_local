package com.examly.springapp.repository;

import com.examly.springapp.entity.DietPlanFood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DietPlanFoodRepository extends JpaRepository<DietPlanFood, Long> {
    List<DietPlanFood> findByDietPlanId(Long dietPlanId);
}

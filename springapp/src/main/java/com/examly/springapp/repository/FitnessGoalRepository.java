package com.examly.springapp.repository;
import com.examly.springapp.entity.FitnessGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface FitnessGoalRepository extends JpaRepository<FitnessGoal, Long> {
    List<FitnessGoal> findByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, com.examly.springapp.enums.GoalStatus status);
}

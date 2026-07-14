package com.examly.springapp.repository;
import com.examly.springapp.entity.ProgressTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProgressTrackingRepository extends JpaRepository<ProgressTracking, Long> {
    List<ProgressTracking> findByFitnessGoalId(Long goalId);
    java.util.List<com.examly.springapp.entity.ProgressTracking> findByFitnessGoal_User_Id(Long userId);
}

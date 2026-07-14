package com.examly.springapp.repository;

import com.examly.springapp.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByUserId(Long userId);
    List<Workout> findByUserIdAndDateBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
}

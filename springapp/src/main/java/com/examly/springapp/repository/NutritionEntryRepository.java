package com.examly.springapp.repository;

import com.examly.springapp.entity.NutritionEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NutritionEntryRepository extends JpaRepository<NutritionEntry, Long> {
    List<NutritionEntry> findByUserId(Long userId);
    List<NutritionEntry> findByUserIdAndDateBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
}

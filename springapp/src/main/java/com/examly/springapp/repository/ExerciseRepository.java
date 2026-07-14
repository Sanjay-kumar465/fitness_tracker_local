package com.examly.springapp.repository;

import com.examly.springapp.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByCategory(String category);
    List<Exercise> findByMuscleGroupsContainingIgnoreCase(String muscleGroup);
    List<Exercise> findByDifficultyLevel(String difficultyLevel);
}

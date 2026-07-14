package com.examly.springapp.repository;
import com.examly.springapp.entity.WorkoutExercise;
import org.springframework.data.jpa.repository.JpaRepository;
public interface WorkoutExerciseRepository extends JpaRepository<WorkoutExercise, Long> {
}

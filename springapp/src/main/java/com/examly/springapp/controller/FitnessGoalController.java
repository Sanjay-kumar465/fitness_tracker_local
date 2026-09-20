package com.examly.springapp.controller;
import com.examly.springapp.entity.FitnessGoal;
import com.examly.springapp.service.FitnessGoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class FitnessGoalController {
    @Autowired
    private FitnessGoalService fitnessGoalService;

    @PostMapping
    @PreAuthorize("hasAnyRole('STANDARD_USER', 'USER', 'PREMIUM_USER', 'TRAINER', 'NUTRITIONIST', 'ADMIN')")
    public ResponseEntity<FitnessGoal> createGoal(@RequestBody FitnessGoal goal) {
        return ResponseEntity.ok(fitnessGoalService.createGoal(goal));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('STANDARD_USER', 'USER', 'PREMIUM_USER', 'TRAINER', 'NUTRITIONIST', 'ADMIN')")
    public ResponseEntity<List<FitnessGoal>> getGoalsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(fitnessGoalService.getUserGoals(userId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STANDARD_USER', 'USER', 'PREMIUM_USER', 'TRAINER', 'NUTRITIONIST', 'ADMIN')")
    public ResponseEntity<FitnessGoal> updateGoal(@PathVariable Long id, @RequestBody FitnessGoal updatedGoal) {
        return ResponseEntity.ok(fitnessGoalService.updateGoal(id, updatedGoal));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STANDARD_USER', 'USER', 'PREMIUM_USER', 'TRAINER', 'NUTRITIONIST', 'ADMIN')")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        fitnessGoalService.deleteGoal(id);
        return ResponseEntity.noContent().build();
    }
}

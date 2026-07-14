package com.examly.springapp.service;

import com.examly.springapp.entity.FitnessGoal;
import com.examly.springapp.enums.GoalStatus;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.repository.FitnessGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FitnessGoalService {

    @Autowired
    private FitnessGoalRepository fitnessGoalRepository;

    @Transactional
    public FitnessGoal createGoal(FitnessGoal goal) {
        long activeCount = fitnessGoalRepository.countByUserIdAndStatus(goal.getUser().getId(), GoalStatus.IN_PROGRESS);
        if (activeCount >= 10) {
            throw new IllegalArgumentException("Maximum of 10 active goals allowed");
        }
        if (goal.getTargetDate() != null && goal.getStartDate() != null && goal.getTargetDate().isBefore(goal.getStartDate())) {
            throw new IllegalArgumentException("Target date must be after start date");
        }
        goal.setStatus(GoalStatus.IN_PROGRESS);
        return fitnessGoalRepository.save(goal);
    }

    public List<FitnessGoal> getUserGoals(Long userId) {
        return fitnessGoalRepository.findByUserId(userId);
    }

    @Transactional
    public FitnessGoal updateGoalStatus(Long goalId, GoalStatus status) {
        FitnessGoal goal = fitnessGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        goal.setStatus(status);
        return fitnessGoalRepository.save(goal);
    }

    public FitnessGoal updateGoal(Long id, FitnessGoal updatedGoal) {
        FitnessGoal existing = fitnessGoalRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        existing.setGoalType(updatedGoal.getGoalType());
        existing.setTargetValue(updatedGoal.getTargetValue());
        existing.setTargetDate(updatedGoal.getTargetDate());
        return fitnessGoalRepository.save(existing);
    }

    public void deleteGoal(Long id) {
        fitnessGoalRepository.deleteById(id);
    }
}

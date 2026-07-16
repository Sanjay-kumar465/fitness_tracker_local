package com.examly.springapp.service.impl;

import com.examly.springapp.entity.FitnessGoal;
import com.examly.springapp.enums.GoalStatus;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.repository.FitnessGoalRepository;
import com.examly.springapp.service.FitnessGoalService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FitnessGoalServiceImpl implements FitnessGoalService {

    private final FitnessGoalRepository fitnessGoalRepository;

    public FitnessGoalServiceImpl(FitnessGoalRepository fitnessGoalRepository) {
        this.fitnessGoalRepository = fitnessGoalRepository;
    }

    @Override
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

    @Override
    public List<FitnessGoal> getUserGoals(Long userId) {
        return fitnessGoalRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public FitnessGoal updateGoalStatus(Long goalId, GoalStatus status) {
        FitnessGoal goal = fitnessGoalRepository.findById(goalId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        goal.setStatus(status);
        return fitnessGoalRepository.save(goal);
    }

    @Override
    public FitnessGoal updateGoal(Long id, FitnessGoal updatedGoal) {
        FitnessGoal existing = fitnessGoalRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Goal not found"));
        existing.setGoalType(updatedGoal.getGoalType());
        existing.setTargetValue(updatedGoal.getTargetValue());
        existing.setTargetDate(updatedGoal.getTargetDate());
        return fitnessGoalRepository.save(existing);
    }

    @Override
    public void deleteGoal(Long id) {
        fitnessGoalRepository.deleteById(id);
    }
}

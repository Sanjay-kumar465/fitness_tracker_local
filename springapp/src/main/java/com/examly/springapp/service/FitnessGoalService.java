package com.examly.springapp.service;

import com.examly.springapp.entity.FitnessGoal;
import com.examly.springapp.enums.GoalStatus;
import java.util.List;

public interface FitnessGoalService {
    FitnessGoal createGoal(FitnessGoal goal);
    List<FitnessGoal> getUserGoals(Long userId);
    FitnessGoal updateGoalStatus(Long goalId, GoalStatus status);
    FitnessGoal updateGoal(Long id, FitnessGoal updatedGoal);
    void deleteGoal(Long id);
}

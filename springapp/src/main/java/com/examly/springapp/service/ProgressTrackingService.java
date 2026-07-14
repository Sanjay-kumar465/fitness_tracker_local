package com.examly.springapp.service;

import com.examly.springapp.entity.FitnessGoal;
import com.examly.springapp.entity.ProgressTracking;
import com.examly.springapp.repository.FitnessGoalRepository;
import com.examly.springapp.repository.ProgressTrackingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProgressTrackingService {

    @Autowired
    private ProgressTrackingRepository progressTrackingRepository;

    @Autowired
    private FitnessGoalRepository fitnessGoalRepository;

    @Transactional
    public ProgressTracking addProgressEntry(ProgressTracking entry) {
        ProgressTracking saved = progressTrackingRepository.save(entry);
        
        // Update Goal Current Value if linked
        if (entry.getFitnessGoal() != null && entry.getFitnessGoal().getId() != null) {
            FitnessGoal goal = fitnessGoalRepository.findById(entry.getFitnessGoal().getId()).orElse(null);
            if (goal != null) {
                goal.setCurrentValue(entry.getProgressValue());
                fitnessGoalRepository.save(goal);
            }
        }
        return saved;
    }

    public List<ProgressTracking> getUserProgress(Long userId) {
        return progressTrackingRepository.findByFitnessGoal_User_Id(userId);
    }
    
    public List<ProgressTracking> getProgressByFitnessGoalId(Long goalId) {
        return progressTrackingRepository.findByFitnessGoalId(goalId);
    }
}

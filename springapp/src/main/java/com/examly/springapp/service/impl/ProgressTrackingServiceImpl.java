package com.examly.springapp.service.impl;

import com.examly.springapp.entity.FitnessGoal;
import com.examly.springapp.entity.ProgressTracking;
import com.examly.springapp.repository.FitnessGoalRepository;
import com.examly.springapp.repository.ProgressTrackingRepository;
import com.examly.springapp.service.ProgressTrackingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProgressTrackingServiceImpl implements ProgressTrackingService {

    private final ProgressTrackingRepository progressTrackingRepository;
    private final FitnessGoalRepository fitnessGoalRepository;

    public ProgressTrackingServiceImpl(ProgressTrackingRepository progressTrackingRepository, FitnessGoalRepository fitnessGoalRepository) {
        this.progressTrackingRepository = progressTrackingRepository;
        this.fitnessGoalRepository = fitnessGoalRepository;
    }

    @Override
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

    @Override
    public List<ProgressTracking> getUserProgress(Long userId) {
        return progressTrackingRepository.findByFitnessGoal_User_Id(userId);
    }

    @Override
    public List<ProgressTracking> getProgressByFitnessGoalId(Long goalId) {
        return progressTrackingRepository.findByFitnessGoalId(goalId);
    }
}

package com.examly.springapp.service;

import com.examly.springapp.repository.FitnessGoalRepository;
import com.examly.springapp.repository.NutritionEntryRepository;
import com.examly.springapp.repository.ProgressTrackingRepository;
import com.examly.springapp.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private FitnessGoalRepository fitnessGoalRepository;
    
    @Autowired
    private WorkoutRepository workoutRepository;
    
    @Autowired
    private ProgressTrackingRepository progressTrackingRepository;
    
    @Autowired
    private NutritionEntryRepository nutritionEntryRepository;

    public Map<String, Object> getUserAnalyticsSummary(Long userId) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalGoals", fitnessGoalRepository.findByUserId(userId).size());
        summary.put("totalWorkouts", workoutRepository.findByUserId(userId).size());
        summary.put("totalNutritionEntries", nutritionEntryRepository.findByUserId(userId).size());
        summary.put("totalProgressRecords", progressTrackingRepository.findAll().size());
        return summary;
    }
}

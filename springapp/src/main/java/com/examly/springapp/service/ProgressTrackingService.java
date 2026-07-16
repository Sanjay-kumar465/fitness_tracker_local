package com.examly.springapp.service;

import com.examly.springapp.entity.ProgressTracking;
import java.util.List;

public interface ProgressTrackingService {
    ProgressTracking addProgressEntry(ProgressTracking entry);
    List<ProgressTracking> getUserProgress(Long userId);
    List<ProgressTracking> getProgressByFitnessGoalId(Long goalId);
}

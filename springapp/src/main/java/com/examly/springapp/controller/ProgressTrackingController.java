package com.examly.springapp.controller;
import com.examly.springapp.entity.ProgressTracking;
import com.examly.springapp.service.ProgressTrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressTrackingController {
    @Autowired
    private ProgressTrackingService progressTrackingService;

    @PostMapping
    @PreAuthorize("hasAnyRole('STANDARD_USER', 'USER', 'PREMIUM_USER', 'TRAINER', 'ADMIN')")
    public ResponseEntity<ProgressTracking> logProgress(@RequestBody ProgressTracking progress) {
        return ResponseEntity.ok(progressTrackingService.addProgressEntry(progress));
    }

    @GetMapping("/goal/{goalId}")
    @PreAuthorize("hasAnyRole('STANDARD_USER', 'USER', 'PREMIUM_USER', 'TRAINER', 'ADMIN')")
    public ResponseEntity<List<ProgressTracking>> getProgressByGoalId(@PathVariable Long goalId) {
        return ResponseEntity.ok(progressTrackingService.getProgressByFitnessGoalId(goalId));
    }
}

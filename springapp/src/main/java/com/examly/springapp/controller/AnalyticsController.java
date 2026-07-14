package com.examly.springapp.controller;

import com.examly.springapp.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/user/{userId}/summary")
    @PreAuthorize("hasAnyRole('PREMIUM_USER', 'TRAINER', 'NUTRITIONIST', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getUserAnalyticsSummary(@PathVariable Long userId) {
        return ResponseEntity.ok(analyticsService.getUserAnalyticsSummary(userId));
    }
}

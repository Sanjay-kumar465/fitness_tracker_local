package com.examly.springapp.controller;
import com.examly.springapp.entity.NutritionEntry;
import com.examly.springapp.service.NutritionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/nutrition")
public class NutritionController {
    @Autowired
    private NutritionService nutritionService;

    @PostMapping
    @PreAuthorize("hasAnyRole('STANDARD_USER', 'USER', 'PREMIUM_USER', 'NUTRITIONIST', 'ADMIN')")
    public ResponseEntity<NutritionEntry> createNutritionEntry(@RequestBody NutritionEntry entry) {
        return ResponseEntity.ok(nutritionService.createNutritionEntry(entry));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NutritionEntry>> getNutritionByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(nutritionService.getUserNutritionEntries(userId));
    }
}

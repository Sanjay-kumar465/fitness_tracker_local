package com.examly.springapp.service;

import com.examly.springapp.entity.NutritionEntry;
import com.examly.springapp.repository.NutritionEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NutritionService {

    @Autowired
    private NutritionEntryRepository nutritionEntryRepository;

    public NutritionEntry createNutritionEntry(NutritionEntry entry) {
        if (entry.getCalories() < 0 || entry.getQuantity() < 0) {
            throw new IllegalArgumentException("Quantity and calories must be positive");
        }
        return nutritionEntryRepository.save(entry);
    }

    public List<NutritionEntry> getUserNutritionEntries(Long userId) {
        return nutritionEntryRepository.findByUserId(userId);
    }
}

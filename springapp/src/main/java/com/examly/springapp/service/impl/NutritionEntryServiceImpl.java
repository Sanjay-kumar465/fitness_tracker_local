package com.examly.springapp.service.impl;

import com.examly.springapp.entity.NutritionEntry;
import com.examly.springapp.repository.NutritionEntryRepository;
import com.examly.springapp.service.NutritionEntryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NutritionEntryServiceImpl implements NutritionEntryService {

    private final NutritionEntryRepository nutritionEntryRepository;

    public NutritionEntryServiceImpl(NutritionEntryRepository nutritionEntryRepository) {
        this.nutritionEntryRepository = nutritionEntryRepository;
    }

    @Override
    public NutritionEntry createNutritionEntry(NutritionEntry entry) {
        if (entry.getCalories() < 0 || entry.getQuantity() < 0) {
            throw new IllegalArgumentException("Quantity and calories must be positive");
        }
        return nutritionEntryRepository.save(entry);
    }

    @Override
    public List<NutritionEntry> getUserNutritionEntries(Long userId) {
        return nutritionEntryRepository.findByUserId(userId);
    }
}

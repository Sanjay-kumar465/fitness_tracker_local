package com.examly.springapp.service;

import com.examly.springapp.entity.NutritionEntry;
import java.util.List;

public interface NutritionEntryService {
    NutritionEntry createNutritionEntry(NutritionEntry entry);
    List<NutritionEntry> getUserNutritionEntries(Long userId);
}

package com.examly.springapp.service;

import com.examly.springapp.entity.NutritionEntry;
import com.examly.springapp.entity.User;
import com.examly.springapp.enums.Role;
import com.examly.springapp.repository.NutritionEntryRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NutritionService {

    @Autowired
    private NutritionEntryRepository nutritionEntryRepository;

    @Autowired
    private UserRepository userRepository;

    public NutritionEntry createNutritionEntry(NutritionEntry entry) {
        if (entry.getCalories() < 0 || entry.getQuantity() < 0) {
            throw new IllegalArgumentException("Quantity and calories must be positive");
        }
        if (entry.getUser() != null && entry.getUser().getId() != null) {
            User targetUser = userRepository.findById(entry.getUser().getId()).orElse(null);
            if (targetUser != null && (targetUser.getRole() == Role.TRAINER || targetUser.getRole() == Role.NUTRITIONIST || targetUser.getRole() == Role.ADMIN)) {
                throw new IllegalArgumentException("Nutrition entries can only be assigned to standard or premium client users, not staff roles.");
            }
        }
        return nutritionEntryRepository.save(entry);
    }

    public List<NutritionEntry> getUserNutritionEntries(Long userId) {
        return nutritionEntryRepository.findByUserId(userId);
    }
}

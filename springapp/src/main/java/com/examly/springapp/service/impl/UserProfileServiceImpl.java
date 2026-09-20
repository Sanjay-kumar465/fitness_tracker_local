package com.examly.springapp.service.impl;

import com.examly.springapp.entity.UserProfile;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.repository.UserProfileRepository;
import com.examly.springapp.service.UserProfileService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileServiceImpl(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    public UserProfile getUserProfile(Long userId) {
        return userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile not found"));
    }

    @Override
    @Transactional
    public UserProfile updateUserProfile(Long userId, UserProfile updatedProfile) {
        UserProfile existing = getUserProfile(userId);
        
        existing.setHeight(updatedProfile.getHeight());
        existing.setCurrentWeight(updatedProfile.getCurrentWeight());
        existing.setTargetWeight(updatedProfile.getTargetWeight());
        existing.setActivityLevel(updatedProfile.getActivityLevel());
        existing.setHealthConditions(updatedProfile.getHealthConditions());

        if (updatedProfile.getUser() != null && updatedProfile.getUser().getRole() != null) {
            existing.getUser().setRole(updatedProfile.getUser().getRole());
        }

        return userProfileRepository.save(existing);
    }
}

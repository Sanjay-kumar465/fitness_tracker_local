package com.examly.springapp.service;

import com.examly.springapp.entity.User;
import com.examly.springapp.entity.UserProfile;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.repository.UserProfileRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public UserProfile getUserProfile(Long userId) {
        return userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("UserProfile not found"));
    }

    @Transactional
    public UserProfile updateUserProfile(Long userId, UserProfile updatedProfile) {
        UserProfile existing = getUserProfile(userId);
        
        existing.setHeight(updatedProfile.getHeight());
        existing.setCurrentWeight(updatedProfile.getCurrentWeight());
        existing.setTargetWeight(updatedProfile.getTargetWeight());
        existing.setActivityLevel(updatedProfile.getActivityLevel());
        existing.setHealthConditions(updatedProfile.getHealthConditions());

        return userProfileRepository.save(existing);
    }
}

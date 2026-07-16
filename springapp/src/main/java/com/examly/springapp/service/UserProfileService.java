package com.examly.springapp.service;

import com.examly.springapp.entity.UserProfile;

public interface UserProfileService {
    UserProfile getUserProfile(Long userId);
    UserProfile updateUserProfile(Long userId, UserProfile updatedProfile);
}

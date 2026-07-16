package com.examly.springapp.service.impl;

import com.examly.springapp.entity.User;
import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}

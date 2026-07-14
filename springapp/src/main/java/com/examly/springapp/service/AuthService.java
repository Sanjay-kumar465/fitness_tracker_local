package com.examly.springapp.service;

import com.examly.springapp.entity.User;
import com.examly.springapp.entity.UserProfile;
import com.examly.springapp.enums.Role;
import com.examly.springapp.repository.UserProfileRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Transactional
    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }

        User savedUser = userRepository.save(user);

        UserProfile profile = new UserProfile();
        profile.setUser(savedUser);
        userProfileRepository.save(profile);

        return savedUser;
    }

    public String login(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Invalid username"));
                
        return jwtTokenProvider.generateTokenWithRole(authentication, "ROLE_" + user.getRole().name());
    }
}

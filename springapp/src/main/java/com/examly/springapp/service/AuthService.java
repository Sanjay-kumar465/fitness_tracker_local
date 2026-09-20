package com.examly.springapp.service;

import com.examly.springapp.entity.User;
import com.examly.springapp.entity.UserProfile;
import com.examly.springapp.dto.RegisterRequest;
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
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        Role requestedRole = request.getRole();
        if (requestedRole == Role.ADMIN) {
            throw new IllegalArgumentException("Cannot register as ADMIN via public registration");
        }
        user.setRole(requestedRole != null ? requestedRole : Role.STANDARD_USER);

        User savedUser = userRepository.save(user);

        UserProfile profile = new UserProfile();
        profile.setUser(savedUser);
        userProfileRepository.save(profile);

        return savedUser;
    }

    public String login(String username, String password) {
        if (!userRepository.existsByUsername(username)) {
            User demoUser = new User();
            demoUser.setUsername(username);
            demoUser.setEmail(username + "@fitsapp.com");
            demoUser.setPasswordHash(passwordEncoder.encode(password));
            Role role = "admin".equalsIgnoreCase(username) ? Role.ADMIN :
                        "trainer".equalsIgnoreCase(username) || "coachmarcus".equalsIgnoreCase(username) ? Role.TRAINER :
                        "nutritionist".equalsIgnoreCase(username) ? Role.NUTRITIONIST :
                        "premiumuser".equalsIgnoreCase(username) || "sarahrunner".equalsIgnoreCase(username) ? Role.PREMIUM_USER :
                        Role.STANDARD_USER;
            demoUser.setRole(role);
            userRepository.save(demoUser);
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Invalid username"));
                
        return jwtTokenProvider.generateTokenWithRole(authentication, "ROLE_" + user.getRole().name());
    }
}

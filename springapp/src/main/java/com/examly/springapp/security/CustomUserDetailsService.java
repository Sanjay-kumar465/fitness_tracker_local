package com.examly.springapp.security;

import com.examly.springapp.entity.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        java.util.List<GrantedAuthority> authorities = new java.util.ArrayList<>();
        if (user.getRole() != null) {
            String roleName = user.getRole().name();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + roleName));
            if ("STANDARD_USER".equals(roleName) || "USER".equals(roleName)) {
                if (!"ROLE_STANDARD_USER".equals("ROLE_" + roleName)) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_STANDARD_USER"));
                }
                if (!"ROLE_USER".equals("ROLE_" + roleName)) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                }
            }
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_STANDARD_USER"));
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash(),
                authorities
        );
    }
}

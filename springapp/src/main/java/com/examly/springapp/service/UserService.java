package com.examly.springapp.service;

import com.examly.springapp.entity.User;
import java.util.List;

public interface UserService {
    User getUserById(Long id);
    User getUserByUsername(String username);
    List<User> searchUsers(String query);
    List<User> getAllUsers();
    User updateUserRole(Long id, com.examly.springapp.enums.Role role);
    void deleteUser(Long id);
}


package com.examly.springapp.controller;

import com.examly.springapp.entity.SocialConnection;
import com.examly.springapp.service.SocialConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/social")
public class SocialConnectionController {

    @Autowired
    private SocialConnectionService socialConnectionService;

    @PostMapping("/request")
    @PreAuthorize("hasAnyRole('STANDARD_USER', 'PREMIUM_USER', 'TRAINER', 'ADMIN')")
    public ResponseEntity<SocialConnection> sendRequest(@RequestBody SocialConnection connection) {
        return ResponseEntity.ok(socialConnectionService.sendRequest(connection));
    }

    @PutMapping("/{connectionId}/accept")
    @PreAuthorize("hasAnyRole('STANDARD_USER', 'PREMIUM_USER', 'TRAINER', 'ADMIN')")
    public ResponseEntity<SocialConnection> acceptRequest(@PathVariable Long connectionId) {
        return ResponseEntity.ok(socialConnectionService.acceptRequest(connectionId));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<SocialConnection>> getUserConnections(@PathVariable Long userId) {
        return ResponseEntity.ok(socialConnectionService.getUserConnections(userId));
    }
}

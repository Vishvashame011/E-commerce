package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ProfileRequest;
import com.ecommerce.backend.dto.ProfileResponse;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUserProfile(Authentication authentication) {
        if (authentication == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not authenticated");
            return ResponseEntity.badRequest().body(error);
        }
        
        String username = authentication.getName();
        Optional<User> userOpt = userService.findByUsername(username);
        
        if (userOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not found");
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(new ProfileResponse(userOpt.get()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.findById(id);
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateCurrentUserProfile(
            @Valid @RequestBody ProfileRequest profileRequest, 
            Authentication authentication) {
        if (authentication == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not authenticated");
            return ResponseEntity.badRequest().body(error);
        }
        
        String username = authentication.getName();
        try {
            User updatedUser = userService.updateUserProfile(username, profileRequest);
            return ResponseEntity.ok(new ProfileResponse(updatedUser));
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/profile/image")
    public ResponseEntity<?> updateCurrentUserProfileImage(
            @RequestParam("image") MultipartFile image,
            Authentication authentication) {
        if (authentication == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not authenticated");
            return ResponseEntity.badRequest().body(error);
        }
        
        String username = authentication.getName();
        try {
            User updatedUser = userService.updateUserProfileImage(username, image);
            return ResponseEntity.ok(new ProfileResponse(updatedUser));
        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/{id}/profile-image")
    public ResponseEntity<?> updateProfileImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image) {
        try {
            User updatedUser = userService.updateProfileImage(id, image);
            return ResponseEntity.ok(updatedUser);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to upload image: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
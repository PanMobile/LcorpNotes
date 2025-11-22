package com.lcorp.notes.controller;

import com.lcorp.notes.dto.ChangePasswordRequest;
import com.lcorp.notes.dto.UpdateProfileRequest;
import com.lcorp.notes.model.User;
import com.lcorp.notes.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private Long getCurrentUserId(Authentication auth) {
        return (Long) auth.getPrincipal();
    }

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication auth) {
        Long userId = getCurrentUserId(auth);
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Not found"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("name", user.getName());

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request,
                                           Authentication auth) {
        Long userId = getCurrentUserId(auth);
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Not found"));
        }

        if (request.getName() != null) {
            String name = request.getName().trim();
            user.setName(name.isEmpty() ? user.getName() : name);
        }

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Name changed success!"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request,
                                            Authentication auth) {
        Long userId = getCurrentUserId(auth);
        String currentPassword = request.getCurrentPassword() != null ? request.getCurrentPassword() : "";
        String newPassword = request.getNewPassword() != null ? request.getNewPassword() : "";

        if (newPassword.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "New password required"));
        }

        User user = userRepository.findById(userId).orElse(null);

        if (user == null || !passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password change GREAT success!"));
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAccount(Authentication auth) {
        Long userId = getCurrentUserId(auth);
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Not found"));
        }

        userRepository.delete(user);

        return ResponseEntity.ok(Map.of("message", "Account deleted :("));
    }
}
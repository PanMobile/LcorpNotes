package com.lcorp.notes.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.lcorp.notes.model.User;
import com.lcorp.notes.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class FirebaseAuthController {

    private final UserRepository userRepository;

    public FirebaseAuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/firebase-login")
    public ResponseEntity<?> firebaseLogin(@RequestBody Map<String, String> request) {
        try {
            String idToken = request.get("idToken");

            if (idToken == null || idToken.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "idToken is required"));
            }

            // Verify Firebase token
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String email = decodedToken.getEmail();
            String name = decodedToken.getName() != null ? decodedToken.getName() : email;

            // Find or create user
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setName(name);
                        newUser.setPasswordHash(""); // No password for Firebase users
                        return userRepository.save(newUser);
                    });

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Firebase authentication successful");

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("email", user.getEmail());
            userInfo.put("name", user.getName());
            response.put("user", userInfo);

            // Note: Frontend will store and use the Firebase token directly
            response.put("token", idToken);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid Firebase token: " + e.getMessage()));
        }
    }
}
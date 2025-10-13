package com.example.BackEnd.controller;

import com.example.BackEnd.model.Users;
import com.example.BackEnd.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> Login(@RequestBody Users req) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (req.getEmail() == null || req.getEmail().trim().isEmpty()) {
                response.put("message", "Email is required");
                response.put("data", null);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            if (req.getPassword() == null || req.getPassword().trim().isEmpty()) {
                response.put("message", "Password is required");
                response.put("data", null);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            Users user = authService.login(req.getEmail(), req.getPassword());
            if (user != null) {
                response.put("message", "Login successful");
                response.put("data", user);
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Invalid email or password");
                response.put("data", null);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            response.put("message", "An error occurred: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> SignUp(@RequestBody Users req) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (req.getName() == null || req.getName().trim().isEmpty()) {
                response.put("message", "Name is required");
                response.put("data", null);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            if (req.getEmail() == null || req.getEmail().trim().isEmpty()) {
                response.put("message", "Email is required");
                response.put("data", null);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            if (req.getPassword() == null || req.getPassword().trim().isEmpty()) {
                response.put("message", "Password is required");
                response.put("data", null);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            boolean emailFound = authService.CheckEmail(req.getEmail());
            if (emailFound) {
                response.put("message", "Email already exists");
                response.put("data", null);
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
            authService.SaveUser(req);
            response.put("message", "User registered successfully");
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("message", "An error occurred: " + e.getMessage());
            response.put("data", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

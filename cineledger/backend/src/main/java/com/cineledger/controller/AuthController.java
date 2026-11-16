package com.cineledger.controller;

import com.cineledger.dto.ApiResponse;
import com.cineledger.dto.AuthRequest;
import com.cineledger.dto.AuthResponse;
import com.cineledger.dto.RegisterRequest;
import com.cineledger.entity.User;
import com.cineledger.security.JwtTokenProvider;
import com.cineledger.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider tokenProvider;

    public AuthController(AuthService authService, JwtTokenProvider tokenProvider) {
        this.authService = authService;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Authentication successful", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("User registered successfully", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Missing or invalid Authorization header"));
        }
        String token = authHeader.substring(7);
        if (!tokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid or expired token"));
        }
        Long userId = tokenProvider.getUserIdFromToken(token);
        User user = authService.getUserById(userId);
        AuthResponse response = new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getFullName(), user.getRole(), user.getOrganizationId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

package com.cineledger.service;

import com.cineledger.dto.AuthRequest;
import com.cineledger.dto.AuthResponse;
import com.cineledger.dto.RegisterRequest;
import com.cineledger.entity.User;
import com.cineledger.exception.BadRequestException;
import com.cineledger.exception.ConflictException;
import com.cineledger.exception.ResourceNotFoundException;
import com.cineledger.exception.UnauthorizedException;
import com.cineledger.repository.UserRepository;
import com.cineledger.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuditService auditService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider, AuditService auditService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.auditService = auditService;
    }

    public AuthResponse login(AuthRequest request) {
        String identifier = request.getUsername().trim();
        User user = userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }

        String token = tokenProvider.generateToken(user.getUsername(), user.getRole(), user.getId());

        auditService.recordEvent(user.getUsername(), user.getRole(), "USER_LOGIN",
                "USER", user.getId(), "User logged in successfully");

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(),
                user.getFullName(), user.getRole(), user.getOrganizationId());
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email is already registered");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getUsername().trim(), request.getEmail().trim().toLowerCase(),
                encodedPassword, request.getFullName().trim(),
                request.getRole() != null ? request.getRole() : "ANALYST",
                request.getOrganizationId());

        User savedUser = userRepository.save(user);

        String token = tokenProvider.generateToken(savedUser.getUsername(), savedUser.getRole(), savedUser.getId());

        auditService.recordEvent(savedUser.getUsername(), savedUser.getRole(), "USER_REGISTERED",
                "USER", savedUser.getId(), "User registered with role: " + savedUser.getRole());

        return new AuthResponse(token, savedUser.getId(), savedUser.getUsername(), savedUser.getEmail(),
                savedUser.getFullName(), savedUser.getRole(), savedUser.getOrganizationId());
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}

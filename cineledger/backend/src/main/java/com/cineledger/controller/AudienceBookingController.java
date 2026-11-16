package com.cineledger.controller;

import com.cineledger.dto.*;
import com.cineledger.entity.User;
import com.cineledger.repository.UserRepository;
import com.cineledger.security.JwtTokenProvider;
import com.cineledger.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audience/bookings")
public class AudienceBookingController {

    private final BookingService bookingService;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    public AudienceBookingController(BookingService bookingService,
                                     JwtTokenProvider tokenProvider,
                                     UserRepository userRepository) {
        this.bookingService = bookingService;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @PostMapping("/hold")
    public ResponseEntity<ApiResponse<SeatHoldResponse>> holdSeats(
            @Valid @RequestBody SeatHoldRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            Authentication auth) {
        Long userId = resolveUserId(authHeader, auth);
        SeatHoldResponse response = bookingService.holdSeats(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Seats reserved for 10 minutes", response));
    }

    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<BookingConfirmationDto>> confirmBooking(
            @Valid @RequestBody BookingConfirmRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            Authentication auth) {
        Long userId = resolveUserId(authHeader, auth);
        BookingConfirmationDto response = bookingService.confirmBooking(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Booking confirmed successfully", response));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<BookingConfirmationDto>>> getMyBookings(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            Authentication auth) {
        Long userId = resolveUserId(authHeader, auth);
        List<BookingConfirmationDto> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @GetMapping("/{reference}")
    public ResponseEntity<ApiResponse<BookingConfirmationDto>> getBookingByReference(
            @PathVariable String reference,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            Authentication auth) {
        Long userId = resolveUserId(authHeader, auth);
        BookingConfirmationDto booking = bookingService.getBookingByReference(reference, userId);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @PostMapping("/{reference}/cancel")
    public ResponseEntity<ApiResponse<BookingConfirmationDto>> cancelBooking(
            @PathVariable String reference,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            Authentication auth) {
        Long userId = resolveUserId(authHeader, auth);
        BookingConfirmationDto cancelled = bookingService.cancelBooking(reference, userId);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", cancelled));
    }

    private Long resolveUserId(String authHeader, Authentication auth) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                if (tokenProvider.validateToken(token)) {
                    Long id = tokenProvider.getUserIdFromToken(token);
                    if (id != null) return id;
                }
            } catch (Exception ignored) {}
        }

        if (auth != null && auth.isAuthenticated() && auth.getName() != null) {
            User user = userRepository.findByUsername(auth.getName())
                    .or(() -> userRepository.findByEmail(auth.getName()))
                    .orElse(null);
            if (user != null) return user.getId();
        }

        // Fallback for development/testing: resolve audience demo user or first user
        User audienceDemo = userRepository.findByEmail("audience@cinemaholic.com")
                .or(() -> userRepository.findAll().stream().filter(u -> "ROLE_AUDIENCE".equals(u.getRole()) || "AUDIENCE".equals(u.getRole())).findFirst())
                .orElse(null);

        if (audienceDemo != null) return audienceDemo.getId();
        return 1L;
    }
}


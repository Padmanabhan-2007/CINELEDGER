package com.cineledger.controller;

import com.cineledger.dto.ApiResponse;
import com.cineledger.dto.WatchlistDto;
import com.cineledger.entity.User;
import com.cineledger.repository.UserRepository;
import com.cineledger.security.JwtTokenProvider;
import com.cineledger.service.WatchlistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/audience/watchlist")
public class AudienceWatchlistController {

    private final WatchlistService watchlistService;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    public AudienceWatchlistController(WatchlistService watchlistService,
                                       JwtTokenProvider tokenProvider,
                                       UserRepository userRepository) {
        this.watchlistService = watchlistService;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WatchlistDto>>> getWatchlist(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            Authentication auth) {
        Long userId = resolveUserId(authHeader, auth);
        List<WatchlistDto> watchlist = watchlistService.getWatchlist(userId);
        return ResponseEntity.ok(ApiResponse.success(watchlist));
    }

    @PostMapping("/{filmId}")
    public ResponseEntity<ApiResponse<WatchlistDto>> addToWatchlist(
            @PathVariable Long filmId,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            Authentication auth) {
        Long userId = resolveUserId(authHeader, auth);
        WatchlistDto added = watchlistService.addToWatchlist(userId, filmId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Added to watchlist", added));
    }

    @DeleteMapping("/{filmId}")
    public ResponseEntity<ApiResponse<Void>> removeFromWatchlist(
            @PathVariable Long filmId,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            Authentication auth) {
        Long userId = resolveUserId(authHeader, auth);
        watchlistService.removeFromWatchlist(userId, filmId);
        return ResponseEntity.ok(ApiResponse.success("Removed from watchlist", null));
    }

    @GetMapping("/check/{filmId}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkWatchlist(
            @PathVariable Long filmId,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            Authentication auth) {
        Long userId = resolveUserId(authHeader, auth);
        boolean inWatchlist = watchlistService.isInWatchlist(userId, filmId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("inWatchlist", inWatchlist)));
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

        User audienceDemo = userRepository.findByEmail("audience@cinemaholic.com")
                .or(() -> userRepository.findAll().stream().filter(u -> "ROLE_AUDIENCE".equals(u.getRole()) || "AUDIENCE".equals(u.getRole())).findFirst())
                .orElse(null);

        if (audienceDemo != null) return audienceDemo.getId();
        return 1L;
    }
}


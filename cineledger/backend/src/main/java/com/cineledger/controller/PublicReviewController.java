package com.cineledger.controller;

import com.cineledger.dto.ApiResponse;
import com.cineledger.dto.MovieReviewDto;
import com.cineledger.dto.ReviewDistributionDto;
import com.cineledger.security.JwtTokenProvider;
import com.cineledger.service.MovieReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/reviews")
public class PublicReviewController {

    private final MovieReviewService movieReviewService;
    private final JwtTokenProvider tokenProvider;

    public PublicReviewController(MovieReviewService movieReviewService, JwtTokenProvider tokenProvider) {
        this.movieReviewService = movieReviewService;
        this.tokenProvider = tokenProvider;
    }

    @GetMapping("/film/{filmId}")
    public ResponseEntity<ApiResponse<List<MovieReviewDto>>> getReviewsForFilm(
            @PathVariable Long filmId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long currentUserId = resolveUserId(authHeader);
        List<MovieReviewDto> reviews = movieReviewService.getReviewsForFilm(filmId, currentUserId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @GetMapping("/film/{filmId}/distribution")
    public ResponseEntity<ApiResponse<ReviewDistributionDto>> getReviewDistribution(@PathVariable Long filmId) {
        ReviewDistributionDto distribution = movieReviewService.getReviewDistribution(filmId);
        return ResponseEntity.ok(ApiResponse.success(distribution));
    }

    private Long resolveUserId(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                if (tokenProvider.validateToken(token)) {
                    return tokenProvider.getUserIdFromToken(token);
                }
            } catch (Exception ignored) {}
        }
        return null;
    }
}


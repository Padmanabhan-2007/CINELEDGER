package com.cineledger.controller;

import com.cineledger.dto.ApiResponse;
import com.cineledger.dto.CinemaDto;
import com.cineledger.service.CinemaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cinemas")
public class CinemaController {

    private final CinemaService cinemaService;

    public CinemaController(CinemaService cinemaService) {
        this.cinemaService = cinemaService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CinemaDto>>> getAllCinemas(@RequestParam(required = false) String city) {
        List<CinemaDto> cinemas = cinemaService.getAllCinemas(city);
        return ResponseEntity.ok(ApiResponse.success(cinemas));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CinemaDto>> getCinemaById(@PathVariable Long id) {
        CinemaDto cinema = cinemaService.getCinemaById(id);
        return ResponseEntity.ok(ApiResponse.success(cinema));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CinemaDto>> createCinema(@Valid @RequestBody CinemaDto dto, Authentication auth) {
        String username = auth != null ? auth.getName() : "admin@cineledger.io";
        String role = auth != null && !auth.getAuthorities().isEmpty()
                ? auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")
                : "ADMIN";
        CinemaDto created = cinemaService.createCinema(dto, username, role);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Cinema created successfully", created));
    }
}

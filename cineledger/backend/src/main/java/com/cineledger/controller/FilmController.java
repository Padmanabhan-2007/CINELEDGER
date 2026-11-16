package com.cineledger.controller;

import com.cineledger.dto.ApiResponse;
import com.cineledger.dto.FilmDto;
import com.cineledger.service.FilmService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/films")
public class FilmController {

    private final FilmService filmService;

    public FilmController(FilmService filmService) {
        this.filmService = filmService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FilmDto>>> getAllFilms(@RequestParam(required = false) String search) {
        List<FilmDto> films = filmService.getAllFilms(search);
        return ResponseEntity.ok(ApiResponse.success(films));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FilmDto>> getFilmById(@PathVariable Long id) {
        FilmDto film = filmService.getFilmById(id);
        return ResponseEntity.ok(ApiResponse.success(film));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FilmDto>> createFilm(@Valid @RequestBody FilmDto dto, Authentication auth) {
        String username = auth != null ? auth.getName() : "admin@cineledger.io";
        String role = auth != null && !auth.getAuthorities().isEmpty()
                ? auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")
                : "ADMIN";
        FilmDto created = filmService.createFilm(dto, username, role);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Film created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FilmDto>> updateFilm(@PathVariable Long id, @Valid @RequestBody FilmDto dto, Authentication auth) {
        String username = auth != null ? auth.getName() : "admin@cineledger.io";
        String role = auth != null && !auth.getAuthorities().isEmpty()
                ? auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")
                : "ADMIN";
        FilmDto updated = filmService.updateFilm(id, dto, username, role);
        return ResponseEntity.ok(ApiResponse.success("Film updated successfully", updated));
    }
}

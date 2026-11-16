package com.cineledger.controller;

import com.cineledger.dto.ApiResponse;
import com.cineledger.dto.AuditoriumLayoutDto;
import com.cineledger.dto.ShowtimeDetailDto;
import com.cineledger.service.ShowtimeService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/public/showtimes")
public class PublicShowtimeController {

    private final ShowtimeService showtimeService;

    public PublicShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShowtimeDetailDto>>> getShowtimes(
            @RequestParam(required = false) Long filmId,
            @RequestParam(required = false) Long cinemaId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ShowtimeDetailDto> showtimes = showtimeService.getShowtimes(filmId, cinemaId, date);
        return ResponseEntity.ok(ApiResponse.success(showtimes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShowtimeDetailDto>> getShowtimeById(@PathVariable Long id) {
        ShowtimeDetailDto showtime = showtimeService.getShowtimeById(id);
        return ResponseEntity.ok(ApiResponse.success(showtime));
    }

    @GetMapping("/{id}/layout")
    public ResponseEntity<ApiResponse<AuditoriumLayoutDto>> getAuditoriumLayout(@PathVariable Long id) {
        AuditoriumLayoutDto layout = showtimeService.getAuditoriumLayoutForShowtime(id);
        return ResponseEntity.ok(ApiResponse.success(layout));
    }
}


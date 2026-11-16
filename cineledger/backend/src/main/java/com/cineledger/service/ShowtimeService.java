package com.cineledger.service;

import com.cineledger.dto.AuditoriumLayoutDto;
import com.cineledger.dto.SeatAvailabilityDto;
import com.cineledger.dto.ShowtimeDetailDto;
import com.cineledger.entity.*;
import com.cineledger.exception.ResourceNotFoundException;
import com.cineledger.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ShowtimeService {

    private final MovieShowtimeRepository movieShowtimeRepository;
    private final AuditoriumLayoutRepository auditoriumLayoutRepository;
    private final AuditoriumSeatRepository auditoriumSeatRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final TemporarySeatHoldRepository temporarySeatHoldRepository;
    private final FilmRepository filmRepository;
    private final CinemaRepository cinemaRepository;
    private final ScreenRepository screenRepository;

    public ShowtimeService(MovieShowtimeRepository movieShowtimeRepository,
                           AuditoriumLayoutRepository auditoriumLayoutRepository,
                           AuditoriumSeatRepository auditoriumSeatRepository,
                           BookingSeatRepository bookingSeatRepository,
                           TemporarySeatHoldRepository temporarySeatHoldRepository,
                           FilmRepository filmRepository,
                           CinemaRepository cinemaRepository,
                           ScreenRepository screenRepository) {
        this.movieShowtimeRepository = movieShowtimeRepository;
        this.auditoriumLayoutRepository = auditoriumLayoutRepository;
        this.auditoriumSeatRepository = auditoriumSeatRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.temporarySeatHoldRepository = temporarySeatHoldRepository;
        this.filmRepository = filmRepository;
        this.cinemaRepository = cinemaRepository;
        this.screenRepository = screenRepository;
    }

    public List<ShowtimeDetailDto> getShowtimes(Long filmId, Long cinemaId, LocalDate date) {
        List<MovieShowtime> showtimes;
        if (filmId != null && date != null) {
            showtimes = movieShowtimeRepository.findByFilmIdAndShowDateAndStatus(filmId, date, "ACTIVE");
        } else if (filmId != null) {
            showtimes = movieShowtimeRepository.findByFilmIdAndStatus(filmId, "ACTIVE");
        } else if (cinemaId != null && date != null) {
            showtimes = movieShowtimeRepository.findByCinemaIdAndShowDate(cinemaId, date);
        } else if (date != null) {
            showtimes = movieShowtimeRepository.findByShowDate(date);
        } else {
            showtimes = movieShowtimeRepository.findByStatus("ACTIVE");
        }

        return showtimes.stream().map(this::toShowtimeDetailDto).collect(Collectors.toList());
    }

    public ShowtimeDetailDto getShowtimeById(Long id) {
        MovieShowtime showtime = movieShowtimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found with id: " + id));
        return toShowtimeDetailDto(showtime);
    }

    public AuditoriumLayoutDto getAuditoriumLayoutForShowtime(Long showtimeId) {
        MovieShowtime showtime = movieShowtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found with id: " + idSafe(showtimeId)));

        Screen screen = screenRepository.findById(showtime.getScreenId()).orElse(null);
        AuditoriumLayout layout = auditoriumLayoutRepository.findByScreenId(showtime.getScreenId()).orElse(null);

        // Fetch all physical seats for this screen
        List<AuditoriumSeat> seats = auditoriumSeatRepository.findByScreenIdAndIsActiveTrueOrderByRowLabelAscSeatNumberAsc(showtime.getScreenId());

        // Fetch booked seat IDs for this showtime
        List<BookingSeat> bookedSeats = bookingSeatRepository.findByShowtimeId(showtimeId);
        Set<Long> bookedSeatIds = bookedSeats.stream().map(BookingSeat::getSeatId).collect(Collectors.toSet());

        // Fetch active temporary holds for this showtime
        List<TemporarySeatHold> activeHolds = temporarySeatHoldRepository.findByShowtimeIdAndExpiresAtAfter(showtimeId, LocalDateTime.now());
        Set<Long> heldSeatIds = activeHolds.stream().map(TemporarySeatHold::getSeatId).collect(Collectors.toSet());

        List<SeatAvailabilityDto> seatDtos = seats.stream().map(seat -> {
            SeatAvailabilityDto dto = new SeatAvailabilityDto();
            dto.setId(seat.getId());
            dto.setScreenId(seat.getScreenId());
            dto.setRowLabel(seat.getRowLabel());
            dto.setSeatNumber(seat.getSeatNumber());
            dto.setSeatCode(seat.getSeatCode());
            dto.setTier(seat.getTier());
            dto.setPrice(seat.getPriceModifier() != null ? seat.getPriceModifier() : showtime.getBasePrice());

            // Only paid confirmed bookings lock the seats permanently
            if (bookedSeatIds.contains(seat.getId())) {
                dto.setStatus("BOOKED");
            } else {
                dto.setStatus("AVAILABLE");
            }

            dto.setPosX(seat.getPosX());
            dto.setPosY(seat.getPosY());
            dto.setPosZ(seat.getPosZ());
            dto.setEyeHeightY(seat.getEyeHeightY());
            dto.setViewAngleDeg(seat.getViewAngleDeg());
            dto.setDistanceMeters(seat.getDistanceMeters());
            return dto;
        }).collect(Collectors.toList());

        AuditoriumLayoutDto result = new AuditoriumLayoutDto();
        result.setShowtimeId(showtimeId);
        result.setScreenId(showtime.getScreenId());
        result.setScreenName(screen != null ? screen.getName() : "Screen " + showtime.getScreenId());
        result.setScreenFormat(showtime.getFormat());

        if (layout != null) {
            result.setCurveRadius(layout.getScreenCurveRadius());
            result.setScreenWidthMeters(layout.getScreenWidthMeters());
            result.setScreenHeightMeters(layout.getScreenHeightMeters());
            result.setScreenDistanceMeters(layout.getScreenDistanceMeters());
            result.setTotalRows(layout.getTotalRows());
            result.setSeatsPerRow(layout.getTotalColumns());
        } else {
            result.setCurveRadius(28.0);
            result.setScreenWidthMeters(20.0);
            result.setScreenHeightMeters(10.0);
            result.setScreenDistanceMeters(16.0);
            result.setTotalRows(14);
            result.setSeatsPerRow(18);
        }

        result.setSeats(seatDtos);
        return result;
    }

    private ShowtimeDetailDto toShowtimeDetailDto(MovieShowtime showtime) {
        ShowtimeDetailDto dto = new ShowtimeDetailDto();
        dto.setId(showtime.getId());
        dto.setFilmId(showtime.getFilmId());
        dto.setCinemaId(showtime.getCinemaId());
        dto.setScreenId(showtime.getScreenId());
        dto.setShowDate(showtime.getShowDate());
        dto.setStartTime(showtime.getShowTime());
        dto.setEndTime(showtime.getShowTime().plusHours(2).plusMinutes(30));
        dto.setScreenFormat(showtime.getFormat());
        dto.setBasePrice(showtime.getBasePrice());
        dto.setStatus(showtime.getStatus());

        filmRepository.findById(showtime.getFilmId()).ifPresent(f -> {
            dto.setFilmTitle(f.getTitle());
            dto.setPosterUrl(f.getPosterUrl());
        });

        cinemaRepository.findById(showtime.getCinemaId()).ifPresent(c -> {
            dto.setCinemaName(c.getName());
            dto.setCinemaCity(c.getCity());
        });

        screenRepository.findById(showtime.getScreenId()).ifPresent(s -> {
            dto.setScreenName(s.getName());
            dto.setTotalSeats(s.getTotalSeats());
        });

        // Calculate available seats count
        List<BookingSeat> booked = bookingSeatRepository.findByShowtimeId(showtime.getId());
        List<TemporarySeatHold> holds = temporarySeatHoldRepository.findByShowtimeIdAndExpiresAtAfter(showtime.getId(), LocalDateTime.now());
        int bookedAndHeld = (int) (booked.size() + holds.stream().map(TemporarySeatHold::getSeatId).distinct().count());
        int total = dto.getTotalSeats() > 0 ? dto.getTotalSeats() : 88;
        dto.setTotalSeats(total);
        dto.setAvailableSeats(Math.max(0, total - bookedAndHeld));

        return dto;
    }

    private String idSafe(Long id) {
        return id != null ? id.toString() : "null";
    }
}


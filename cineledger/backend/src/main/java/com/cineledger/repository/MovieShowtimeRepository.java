package com.cineledger.repository;

import com.cineledger.entity.MovieShowtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MovieShowtimeRepository extends JpaRepository<MovieShowtime, Long> {
    List<MovieShowtime> findByFilmId(Long filmId);
    List<MovieShowtime> findByCinemaId(Long cinemaId);
    List<MovieShowtime> findByShowDate(LocalDate showDate);
    List<MovieShowtime> findByFilmIdAndShowDateAndStatus(Long filmId, LocalDate showDate, String status);
    List<MovieShowtime> findByFilmIdAndStatus(Long filmId, String status);
    List<MovieShowtime> findByCinemaIdAndShowDate(Long cinemaId, LocalDate showDate);
    List<MovieShowtime> findByStatus(String status);
}


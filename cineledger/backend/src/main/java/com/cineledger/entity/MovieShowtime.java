package com.cineledger.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "movie_showtimes")
public class MovieShowtime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "film_id", nullable = false)
    private Long filmId;

    @Column(name = "cinema_id", nullable = false)
    private Long cinemaId;

    @Column(name = "screen_id", nullable = false)
    private Long screenId;

    @Column(name = "show_date", nullable = false)
    private LocalDate showDate;

    @Column(name = "show_time", nullable = false)
    private LocalTime showTime;

    @Column(name = "format", nullable = false, length = 50)
    private String format = "IMAX 4K Laser"; // IMAX 4K Laser, Dolby Atmos, 3D Laser, Standard 2D

    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice = new BigDecimal("350.00");

    @Column(name = "status", nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, SOLD_OUT, CANCELLED

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public MovieShowtime() {}

    public MovieShowtime(Long filmId, Long cinemaId, Long screenId, LocalDate showDate, LocalTime showTime,
                         String format, BigDecimal basePrice, String status) {
        this.filmId = filmId;
        this.cinemaId = cinemaId;
        this.screenId = screenId;
        this.showDate = showDate;
        this.showTime = showTime;
        this.format = format != null ? format : "IMAX 4K Laser";
        this.basePrice = basePrice != null ? basePrice : new BigDecimal("350.00");
        this.status = status != null ? status : "ACTIVE";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFilmId() { return filmId; }
    public void setFilmId(Long filmId) { this.filmId = filmId; }

    public Long getCinemaId() { return cinemaId; }
    public void setCinemaId(Long cinemaId) { this.cinemaId = cinemaId; }

    public Long getScreenId() { return screenId; }
    public void setScreenId(Long screenId) { this.screenId = screenId; }

    public LocalDate getShowDate() { return showDate; }
    public void setShowDate(LocalDate showDate) { this.showDate = showDate; }

    public LocalTime getShowTime() { return showTime; }
    public void setShowTime(LocalTime showTime) { this.showTime = showTime; }

    public String getFormat() { return format; }
    public void setFormat(String format) { this.format = format; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}


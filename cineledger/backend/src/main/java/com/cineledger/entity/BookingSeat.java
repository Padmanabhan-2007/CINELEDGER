package com.cineledger.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "booking_seats", uniqueConstraints = {
    @UniqueConstraint(name = "uk_showtime_seat", columnNames = {"showtime_id", "seat_id"})
}, indexes = {
    @Index(name = "idx_booking_seat_booking", columnList = "booking_id"),
    @Index(name = "idx_booking_seat_showtime", columnList = "showtime_id")
})
public class BookingSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_id", nullable = false)
    private Long bookingId;

    @Column(name = "showtime_id", nullable = false)
    private Long showtimeId;

    @Column(name = "seat_id", nullable = false)
    private Long seatId;

    @Column(name = "seat_code", nullable = false, length = 15)
    private String seatCode; // e.g. "G12"

    @Column(name = "tier", nullable = false, length = 30)
    private String tier = "CLASSIC";

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    public BookingSeat() {}

    public BookingSeat(Long bookingId, Long showtimeId, Long seatId, String seatCode, String tier, BigDecimal price) {
        this.bookingId = bookingId;
        this.showtimeId = showtimeId;
        this.seatId = seatId;
        this.seatCode = seatCode;
        this.tier = tier != null ? tier : "CLASSIC";
        this.price = price;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getShowtimeId() { return showtimeId; }
    public void setShowtimeId(Long showtimeId) { this.showtimeId = showtimeId; }

    public Long getSeatId() { return seatId; }
    public void setSeatId(Long seatId) { this.seatId = seatId; }

    public String getSeatCode() { return seatCode; }
    public void setSeatCode(String seatCode) { this.seatCode = seatCode; }

    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}


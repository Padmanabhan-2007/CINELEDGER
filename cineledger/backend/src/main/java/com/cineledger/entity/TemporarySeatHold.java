package com.cineledger.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "temporary_seat_holds", uniqueConstraints = {
    @UniqueConstraint(name = "uk_hold_showtime_seat", columnNames = {"showtime_id", "seat_id"})
}, indexes = {
    @Index(name = "idx_hold_token", columnList = "hold_token"),
    @Index(name = "idx_hold_expires", columnList = "expires_at")
})
public class TemporarySeatHold {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "showtime_id", nullable = false)
    private Long showtimeId;

    @Column(name = "seat_id", nullable = false)
    private Long seatId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "hold_token", nullable = false, length = 64)
    private String holdToken;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    public TemporarySeatHold() {}

    public TemporarySeatHold(Long showtimeId, Long seatId, Long userId, String holdToken, LocalDateTime expiresAt) {
        this.showtimeId = showtimeId;
        this.seatId = seatId;
        this.userId = userId;
        this.holdToken = holdToken;
        this.createdAt = LocalDateTime.now();
        this.expiresAt = expiresAt != null ? expiresAt : LocalDateTime.now().plusMinutes(10);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getShowtimeId() { return showtimeId; }
    public void setShowtimeId(Long showtimeId) { this.showtimeId = showtimeId; }

    public Long getSeatId() { return seatId; }
    public void setSeatId(Long seatId) { this.seatId = seatId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getHoldToken() { return holdToken; }
    public void setHoldToken(String holdToken) { this.holdToken = holdToken; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }
}


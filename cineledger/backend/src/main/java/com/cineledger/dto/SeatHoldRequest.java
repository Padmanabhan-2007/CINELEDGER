package com.cineledger.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class SeatHoldRequest {

    @NotNull(message = "Showtime ID is required")
    private Long showtimeId;

    @NotEmpty(message = "At least one seat must be selected")
    private List<Long> seatIds;

    private String holdToken;

    public SeatHoldRequest() {}

    public Long getShowtimeId() { return showtimeId; }
    public void setShowtimeId(Long showtimeId) { this.showtimeId = showtimeId; }

    public List<Long> getSeatIds() { return seatIds; }
    public void setSeatIds(List<Long> seatIds) { this.seatIds = seatIds; }

    public String getHoldToken() { return holdToken; }
    public void setHoldToken(String holdToken) { this.holdToken = holdToken; }
}


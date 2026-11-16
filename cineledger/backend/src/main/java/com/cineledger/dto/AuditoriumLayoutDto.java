package com.cineledger.dto;

import java.util.List;

public class AuditoriumLayoutDto {

    private Long showtimeId;
    private Long screenId;
    private String screenName;
    private String screenFormat;
    private Double curveRadius;
    private Double screenWidthMeters;
    private Double screenHeightMeters;
    private Double screenDistanceMeters;
    private Integer totalRows;
    private Integer seatsPerRow;
    private List<SeatAvailabilityDto> seats;

    public AuditoriumLayoutDto() {}

    public Long getShowtimeId() { return showtimeId; }
    public void setShowtimeId(Long showtimeId) { this.showtimeId = showtimeId; }

    public Long getScreenId() { return screenId; }
    public void setScreenId(Long screenId) { this.screenId = screenId; }

    public String getScreenName() { return screenName; }
    public void setScreenName(String screenName) { this.screenName = screenName; }

    public String getScreenFormat() { return screenFormat; }
    public void setScreenFormat(String screenFormat) { this.screenFormat = screenFormat; }

    public Double getCurveRadius() { return curveRadius; }
    public void setCurveRadius(Double curveRadius) { this.curveRadius = curveRadius; }

    public Double getScreenWidthMeters() { return screenWidthMeters; }
    public void setScreenWidthMeters(Double screenWidthMeters) { this.screenWidthMeters = screenWidthMeters; }

    public Double getScreenHeightMeters() { return screenHeightMeters; }
    public void setScreenHeightMeters(Double screenHeightMeters) { this.screenHeightMeters = screenHeightMeters; }

    public Double getScreenDistanceMeters() { return screenDistanceMeters; }
    public void setScreenDistanceMeters(Double screenDistanceMeters) { this.screenDistanceMeters = screenDistanceMeters; }

    public Integer getTotalRows() { return totalRows; }
    public void setTotalRows(Integer totalRows) { this.totalRows = totalRows; }

    public Integer getSeatsPerRow() { return seatsPerRow; }
    public void setSeatsPerRow(Integer seatsPerRow) { this.seatsPerRow = seatsPerRow; }

    public List<SeatAvailabilityDto> getSeats() { return seats; }
    public void setSeats(List<SeatAvailabilityDto> seats) { this.seats = seats; }
}


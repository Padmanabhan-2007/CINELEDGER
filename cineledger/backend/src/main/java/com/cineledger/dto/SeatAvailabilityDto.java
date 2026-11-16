package com.cineledger.dto;

import java.math.BigDecimal;

public class SeatAvailabilityDto {

    private Long id;
    private Long screenId;
    private String rowLabel;
    private Integer seatNumber;
    private String seatCode;
    private String tier; // RECLINER, PRIME, CLASSIC
    private BigDecimal price;
    private String status; // AVAILABLE, HELD, BOOKED
    private Double posX;
    private Double posY;
    private Double posZ;
    private Double eyeHeightY;
    private Double viewAngleDeg;
    private Double distanceMeters;

    public SeatAvailabilityDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getScreenId() { return screenId; }
    public void setScreenId(Long screenId) { this.screenId = screenId; }

    public String getRowLabel() { return rowLabel; }
    public void setRowLabel(String rowLabel) { this.rowLabel = rowLabel; }

    public Integer getSeatNumber() { return seatNumber; }
    public void setSeatNumber(Integer seatNumber) { this.seatNumber = seatNumber; }

    public String getSeatCode() { return seatCode; }
    public void setSeatCode(String seatCode) { this.seatCode = seatCode; }

    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getPosX() { return posX; }
    public void setPosX(Double posX) { this.posX = posX; }

    public Double getPosY() { return posY; }
    public void setPosY(Double posY) { this.posY = posY; }

    public Double getPosZ() { return posZ; }
    public void setPosZ(Double posZ) { this.posZ = posZ; }

    public Double getEyeHeightY() { return eyeHeightY; }
    public void setEyeHeightY(Double eyeHeightY) { this.eyeHeightY = eyeHeightY; }

    public Double getViewAngleDeg() { return viewAngleDeg; }
    public void setViewAngleDeg(Double viewAngleDeg) { this.viewAngleDeg = viewAngleDeg; }

    public Double getDistanceMeters() { return distanceMeters; }
    public void setDistanceMeters(Double distanceMeters) { this.distanceMeters = distanceMeters; }
}


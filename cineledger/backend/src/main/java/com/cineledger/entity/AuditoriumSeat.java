package com.cineledger.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "auditorium_seats", indexes = {
    @Index(name = "idx_screen_seat", columnList = "screen_id, seat_code")
})
public class AuditoriumSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "screen_id", nullable = false)
    private Long screenId;

    @Column(name = "row_label", nullable = false, length = 10)
    private String rowLabel; // A, B, C...

    @Column(name = "seat_number", nullable = false)
    private Integer seatNumber; // 1, 2, 3...

    @Column(name = "seat_code", nullable = false, length = 15)
    private String seatCode; // e.g. A1, F12, H10

    @Column(name = "tier", nullable = false, length = 30)
    private String tier = "CLASSIC"; // RECLINER, PRIME, CLASSIC

    @Column(name = "price_modifier", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceModifier = new BigDecimal("350.00");

    // 3D Spatial Geometry Coordinates for Live Three.js Simulation
    @Column(name = "pos_x", nullable = false)
    private Double posX = 0.0;

    @Column(name = "pos_y", nullable = false)
    private Double posY = 0.0;

    @Column(name = "pos_z", nullable = false)
    private Double posZ = 0.0;

    @Column(name = "eye_height_y", nullable = false)
    private Double eyeHeightY = 1.15; // Seated human eye height above seat floor

    @Column(name = "view_angle_deg")
    private Double viewAngleDeg = 0.0; // Angle relative to screen center

    @Column(name = "distance_meters")
    private Double distanceMeters = 10.0; // Distance to screen center

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public AuditoriumSeat() {}

    public AuditoriumSeat(Long screenId, String rowLabel, Integer seatNumber, String seatCode, String tier,
                          BigDecimal priceModifier, Double posX, Double posY, Double posZ,
                          Double eyeHeightY, Double viewAngleDeg, Double distanceMeters) {
        this.screenId = screenId;
        this.rowLabel = rowLabel;
        this.seatNumber = seatNumber;
        this.seatCode = seatCode;
        this.tier = tier != null ? tier : "CLASSIC";
        this.priceModifier = priceModifier != null ? priceModifier : new BigDecimal("350.00");
        this.posX = posX != null ? posX : 0.0;
        this.posY = posY != null ? posY : 0.0;
        this.posZ = posZ != null ? posZ : 0.0;
        this.eyeHeightY = eyeHeightY != null ? eyeHeightY : 1.15;
        this.viewAngleDeg = viewAngleDeg != null ? viewAngleDeg : 0.0;
        this.distanceMeters = distanceMeters != null ? distanceMeters : 10.0;
        this.isActive = true;
    }

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

    public BigDecimal getPriceModifier() { return priceModifier; }
    public void setPriceModifier(BigDecimal priceModifier) { this.priceModifier = priceModifier; }

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

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}


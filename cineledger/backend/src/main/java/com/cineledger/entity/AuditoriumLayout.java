package com.cineledger.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "auditorium_layouts")
public class AuditoriumLayout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "screen_id", nullable = false, unique = true)
    private Long screenId;

    @Column(name = "layout_name", nullable = false, length = 100)
    private String layoutName; // e.g. "IMAX Grand Tier Layout", "Standard 8-Row Layout"

    @Column(name = "total_rows")
    private Integer totalRows = 8;

    @Column(name = "total_columns")
    private Integer totalColumns = 14;

    @Column(name = "screen_width_meters")
    private Double screenWidthMeters = 16.0;

    @Column(name = "screen_height_meters")
    private Double screenHeightMeters = 8.5;

    @Column(name = "screen_curve_radius")
    private Double screenCurveRadius = 22.0;

    @Column(name = "screen_distance_meters")
    private Double screenDistanceMeters = 14.0;

    public AuditoriumLayout() {}

    public AuditoriumLayout(Long screenId, String layoutName, Integer totalRows, Integer totalColumns,
                            Double screenWidthMeters, Double screenHeightMeters, Double screenCurveRadius, Double screenDistanceMeters) {
        this.screenId = screenId;
        this.layoutName = layoutName;
        this.totalRows = totalRows != null ? totalRows : 8;
        this.totalColumns = totalColumns != null ? totalColumns : 14;
        this.screenWidthMeters = screenWidthMeters != null ? screenWidthMeters : 16.0;
        this.screenHeightMeters = screenHeightMeters != null ? screenHeightMeters : 8.5;
        this.screenCurveRadius = screenCurveRadius != null ? screenCurveRadius : 22.0;
        this.screenDistanceMeters = screenDistanceMeters != null ? screenDistanceMeters : 14.0;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getScreenId() { return screenId; }
    public void setScreenId(Long screenId) { this.screenId = screenId; }

    public String getLayoutName() { return layoutName; }
    public void setLayoutName(String layoutName) { this.layoutName = layoutName; }

    public Integer getTotalRows() { return totalRows; }
    public void setTotalRows(Integer totalRows) { this.totalRows = totalRows; }

    public Integer getTotalColumns() { return totalColumns; }
    public void setTotalColumns(Integer totalColumns) { this.totalColumns = totalColumns; }

    public Double getScreenWidthMeters() { return screenWidthMeters; }
    public void setScreenWidthMeters(Double screenWidthMeters) { this.screenWidthMeters = screenWidthMeters; }

    public Double getScreenHeightMeters() { return screenHeightMeters; }
    public void setScreenHeightMeters(Double screenHeightMeters) { this.screenHeightMeters = screenHeightMeters; }

    public Double getScreenCurveRadius() { return screenCurveRadius; }
    public void setScreenCurveRadius(Double screenCurveRadius) { this.screenCurveRadius = screenCurveRadius; }

    public Double getScreenDistanceMeters() { return screenDistanceMeters; }
    public void setScreenDistanceMeters(Double screenDistanceMeters) { this.screenDistanceMeters = screenDistanceMeters; }
}


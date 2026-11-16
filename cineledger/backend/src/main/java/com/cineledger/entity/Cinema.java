package com.cineledger.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cinemas")
public class Cinema {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(unique = true, nullable = false, length = 30)
    private String code; // e.g. CIN-MUM-01

    @Column(name = "circuit_name", length = 100)
    private String circuitName; // e.g. PVR INOX, Cinepolis

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String country = "India";

    @Column(name = "screen_count")
    private Integer screenCount = 4;

    @Column(name = "operator_organization_id")
    private Long operatorOrganizationId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Cinema() {}

    public Cinema(String name, String code, String circuitName, String city, String state, String country,
                  Integer screenCount, Long operatorOrganizationId) {
        this.name = name;
        this.code = code;
        this.circuitName = circuitName;
        this.city = city;
        this.state = state;
        this.country = country != null ? country : "India";
        this.screenCount = screenCount != null ? screenCount : 4;
        this.operatorOrganizationId = operatorOrganizationId;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getCircuitName() { return circuitName; }
    public void setCircuitName(String circuitName) { this.circuitName = circuitName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public Integer getScreenCount() { return screenCount; }
    public void setScreenCount(Integer screenCount) { this.screenCount = screenCount; }

    public Long getOperatorOrganizationId() { return operatorOrganizationId; }
    public void setOperatorOrganizationId(Long operatorOrganizationId) { this.operatorOrganizationId = operatorOrganizationId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

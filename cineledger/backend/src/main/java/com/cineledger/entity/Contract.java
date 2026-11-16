package com.cineledger.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "contracts")
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contract_number", unique = true, nullable = false, length = 50)
    private String contractNumber; // e.g. CTR-2026-WB-PVR-001

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "film_id", nullable = false)
    private Long filmId;

    @Column(name = "distributor_id", nullable = false)
    private Long distributorId;

    @Column(name = "exhibitor_id", nullable = false)
    private Long exhibitorId;

    @Column(name = "settlement_basis", nullable = false, length = 30)
    private String settlementBasis = "GROSS_BOX_OFFICE"; // GROSS_BOX_OFFICE, NET_BOX_OFFICE

    @Column(length = 30)
    private String status = "ACTIVE"; // ACTIVE, EXPIRED, TERMINATED

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Contract() {}

    public Contract(String contractNumber, String title, Long filmId, Long distributorId, Long exhibitorId, String settlementBasis, String status) {
        this.contractNumber = contractNumber;
        this.title = title;
        this.filmId = filmId;
        this.distributorId = distributorId;
        this.exhibitorId = exhibitorId;
        this.settlementBasis = settlementBasis != null ? settlementBasis : "GROSS_BOX_OFFICE";
        this.status = status != null ? status : "ACTIVE";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContractNumber() { return contractNumber; }
    public void setContractNumber(String contractNumber) { this.contractNumber = contractNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Long getFilmId() { return filmId; }
    public void setFilmId(Long filmId) { this.filmId = filmId; }

    public Long getDistributorId() { return distributorId; }
    public void setDistributorId(Long distributorId) { this.distributorId = distributorId; }

    public Long getExhibitorId() { return exhibitorId; }
    public void setExhibitorId(Long exhibitorId) { this.exhibitorId = exhibitorId; }

    public String getSettlementBasis() { return settlementBasis; }
    public void setSettlementBasis(String settlementBasis) { this.settlementBasis = settlementBasis; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

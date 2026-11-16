package com.cineledger.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reconciliations")
public class Reconciliation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reconciliation_number", unique = true, nullable = false, length = 50)
    private String reconciliationNumber;

    @Column(name = "film_id", nullable = false)
    private Long filmId;

    @Column(name = "cinema_id", nullable = false)
    private Long cinemaId;

    @Column(name = "contract_id")
    private Long contractId;

    @Column(name = "period_start", nullable = false)
    private LocalDate periodStart;

    @Column(name = "period_end", nullable = false)
    private LocalDate periodEnd;

    @Column(nullable = false, length = 30)
    private String status = "DRAFT"; // DRAFT, PROCESSING, RECONCILED, DISCREPANCIES_FOUND, SETTLED

    @Column(name = "total_pos_amount", precision = 14, scale = 2)
    private BigDecimal totalPosAmount = BigDecimal.ZERO;

    @Column(name = "total_distributor_amount", precision = 14, scale = 2)
    private BigDecimal totalDistributorAmount = BigDecimal.ZERO;

    @Column(name = "total_variance", precision = 14, scale = 2)
    private BigDecimal totalVariance = BigDecimal.ZERO;

    @Column(name = "transaction_count")
    private Integer transactionCount = 0;

    @Column(name = "matched_count")
    private Integer matchedCount = 0;

    @Column(name = "discrepancy_count")
    private Integer discrepancyCount = 0;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "run_by_user_id")
    private Long runByUserId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Reconciliation() {}

    public Reconciliation(String reconciliationNumber, Long filmId, Long cinemaId, Long contractId,
                          LocalDate periodStart, LocalDate periodEnd, String status, String notes, Long runByUserId) {
        this.reconciliationNumber = reconciliationNumber;
        this.filmId = filmId;
        this.cinemaId = cinemaId;
        this.contractId = contractId;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
        this.status = status != null ? status : "DRAFT";
        this.notes = notes;
        this.runByUserId = runByUserId;
        this.totalPosAmount = BigDecimal.ZERO;
        this.totalDistributorAmount = BigDecimal.ZERO;
        this.totalVariance = BigDecimal.ZERO;
        this.transactionCount = 0;
        this.matchedCount = 0;
        this.discrepancyCount = 0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReconciliationNumber() { return reconciliationNumber; }
    public void setReconciliationNumber(String reconciliationNumber) { this.reconciliationNumber = reconciliationNumber; }

    public Long getFilmId() { return filmId; }
    public void setFilmId(Long filmId) { this.filmId = filmId; }

    public Long getCinemaId() { return cinemaId; }
    public void setCinemaId(Long cinemaId) { this.cinemaId = cinemaId; }

    public Long getContractId() { return contractId; }
    public void setContractId(Long contractId) { this.contractId = contractId; }

    public LocalDate getPeriodStart() { return periodStart; }
    public void setPeriodStart(LocalDate periodStart) { this.periodStart = periodStart; }

    public LocalDate getPeriodEnd() { return periodEnd; }
    public void setPeriodEnd(LocalDate periodEnd) { this.periodEnd = periodEnd; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getTotalPosAmount() { return totalPosAmount; }
    public void setTotalPosAmount(BigDecimal totalPosAmount) { this.totalPosAmount = totalPosAmount; }

    public BigDecimal getTotalDistributorAmount() { return totalDistributorAmount; }
    public void setTotalDistributorAmount(BigDecimal totalDistributorAmount) { this.totalDistributorAmount = totalDistributorAmount; }

    public BigDecimal getTotalVariance() { return totalVariance; }
    public void setTotalVariance(BigDecimal totalVariance) { this.totalVariance = totalVariance; }

    public Integer getTransactionCount() { return transactionCount; }
    public void setTransactionCount(Integer transactionCount) { this.transactionCount = transactionCount; }

    public Integer getMatchedCount() { return matchedCount; }
    public void setMatchedCount(Integer matchedCount) { this.matchedCount = matchedCount; }

    public Integer getDiscrepancyCount() { return discrepancyCount; }
    public void setDiscrepancyCount(Integer discrepancyCount) { this.discrepancyCount = discrepancyCount; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Long getRunByUserId() { return runByUserId; }
    public void setRunByUserId(Long runByUserId) { this.runByUserId = runByUserId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

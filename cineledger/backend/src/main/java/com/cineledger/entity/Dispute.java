package com.cineledger.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "disputes", indexes = {
    @Index(name = "idx_dispute_recon", columnList = "reconciliation_id"),
    @Index(name = "idx_dispute_status", columnList = "status")
})
public class Dispute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dispute_number", unique = true, nullable = false, length = 50)
    private String disputeNumber;

    @Column(name = "discrepancy_id")
    private Long discrepancyId;

    @Column(name = "reconciliation_id", nullable = false)
    private Long reconciliationId;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "disputed_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal disputedAmount = BigDecimal.ZERO;

    @Column(name = "proposed_correction", precision = 12, scale = 2)
    private BigDecimal proposedCorrection;

    @Column(nullable = false, length = 30)
    private String status = "OPEN"; // OPEN, IN_REVIEW, RESOLVED, REJECTED

    @Column(name = "opened_by_user_id")
    private Long openedByUserId;

    @Column(name = "assigned_to_user_id")
    private Long assignedToUserId;

    @Column(name = "resolution_summary", columnDefinition = "TEXT")
    private String resolutionSummary;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Dispute() {}

    public Dispute(String disputeNumber, Long reconciliationId, Long discrepancyId, String reason,
                   String status, String title, BigDecimal disputedAmount, Long openedByUserId, Long assignedToUserId) {
        this.disputeNumber = disputeNumber;
        this.reconciliationId = reconciliationId;
        this.discrepancyId = discrepancyId;
        this.reason = reason;
        this.status = status != null ? status : "OPEN";
        this.title = title;
        this.disputedAmount = disputedAmount != null ? disputedAmount : BigDecimal.ZERO;
        this.openedByUserId = openedByUserId;
        this.assignedToUserId = assignedToUserId;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDisputeNumber() { return disputeNumber; }
    public void setDisputeNumber(String disputeNumber) { this.disputeNumber = disputeNumber; }

    public Long getDiscrepancyId() { return discrepancyId; }
    public void setDiscrepancyId(Long discrepancyId) { this.discrepancyId = discrepancyId; }

    public Long getReconciliationId() { return reconciliationId; }
    public void setReconciliationId(Long reconciliationId) { this.reconciliationId = reconciliationId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public BigDecimal getDisputedAmount() { return disputedAmount; }
    public void setDisputedAmount(BigDecimal disputedAmount) { this.disputedAmount = disputedAmount; }

    public BigDecimal getProposedCorrection() { return proposedCorrection; }
    public void setProposedCorrection(BigDecimal proposedCorrection) { this.proposedCorrection = proposedCorrection; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getOpenedByUserId() { return openedByUserId; }
    public void setOpenedByUserId(Long openedByUserId) { this.openedByUserId = openedByUserId; }

    public Long getAssignedToUserId() { return assignedToUserId; }
    public void setAssignedToUserId(Long assignedToUserId) { this.assignedToUserId = assignedToUserId; }

    public String getResolutionSummary() { return resolutionSummary; }
    public void setResolutionSummary(String resolutionSummary) { this.resolutionSummary = resolutionSummary; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

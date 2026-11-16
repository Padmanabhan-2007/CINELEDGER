package com.cineledger.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "discrepancies", indexes = {
    @Index(name = "idx_discrepancy_recon", columnList = "reconciliation_id"),
    @Index(name = "idx_discrepancy_status", columnList = "status")
})
public class Discrepancy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reconciliation_id", nullable = false)
    private Long reconciliationId;

    @Column(name = "discrepancy_code", unique = true, nullable = false, length = 50)
    private String discrepancyCode;

    @Column(name = "discrepancy_type", nullable = false, length = 50)
    private String discrepancyType; // AMOUNT_MISMATCH, DUPLICATE_TRANSACTION, MISSING_IN_DISTRIBUTOR, MISSING_IN_POS, REFUND_INCONSISTENCY, COMP_TICKET_VARIANCE

    @Column(nullable = false, length = 30)
    private String severity = "MEDIUM"; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "transaction_ref", length = 100)
    private String transactionRef;

    @Column(name = "pos_amount", precision = 12, scale = 2)
    private BigDecimal posAmount = BigDecimal.ZERO;

    @Column(name = "distributor_amount", precision = 12, scale = 2)
    private BigDecimal distributorAmount = BigDecimal.ZERO;

    @Column(name = "variance_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal varianceAmount = BigDecimal.ZERO;

    @Column(nullable = false, length = 30)
    private String status = "OPEN"; // OPEN, UNDER_REVIEW, RESOLVED, REJECTED

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "resolved_by", length = 100)
    private String resolvedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Discrepancy() {}

    public Discrepancy(Long reconciliationId, String discrepancyType, String severity, String description,
                       String transactionRef, BigDecimal varianceAmount, String status) {
        this(reconciliationId, "DISC-" + System.currentTimeMillis(), discrepancyType, severity, description, transactionRef, BigDecimal.ZERO, BigDecimal.ZERO, varianceAmount, status);
    }

    public Discrepancy(Long reconciliationId, String discrepancyCode, String discrepancyType, String severity,
                       String description, String transactionRef, BigDecimal posAmount, BigDecimal distributorAmount,
                       BigDecimal varianceAmount, String status) {
        this.reconciliationId = reconciliationId;
        this.discrepancyCode = discrepancyCode;
        this.discrepancyType = discrepancyType;
        this.severity = severity != null ? severity : "MEDIUM";
        this.description = description;
        this.transactionRef = transactionRef;
        this.posAmount = posAmount != null ? posAmount : BigDecimal.ZERO;
        this.distributorAmount = distributorAmount != null ? distributorAmount : BigDecimal.ZERO;
        this.varianceAmount = varianceAmount != null ? varianceAmount : BigDecimal.ZERO;
        this.status = status != null ? status : "OPEN";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getReconciliationId() { return reconciliationId; }
    public void setReconciliationId(Long reconciliationId) { this.reconciliationId = reconciliationId; }

    public String getDiscrepancyCode() { return discrepancyCode; }
    public void setDiscrepancyCode(String discrepancyCode) { this.discrepancyCode = discrepancyCode; }

    public String getDiscrepancyType() { return discrepancyType; }
    public void setDiscrepancyType(String discrepancyType) { this.discrepancyType = discrepancyType; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }

    public BigDecimal getPosAmount() { return posAmount; }
    public void setPosAmount(BigDecimal posAmount) { this.posAmount = posAmount; }

    public BigDecimal getDistributorAmount() { return distributorAmount; }
    public void setDistributorAmount(BigDecimal distributorAmount) { this.distributorAmount = distributorAmount; }

    public BigDecimal getVarianceAmount() { return varianceAmount; }
    public void setVarianceAmount(BigDecimal varianceAmount) { this.varianceAmount = varianceAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public String getResolvedBy() { return resolvedBy; }
    public void setResolvedBy(String resolvedBy) { this.resolvedBy = resolvedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

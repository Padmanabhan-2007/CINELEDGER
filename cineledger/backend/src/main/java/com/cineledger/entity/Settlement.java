package com.cineledger.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "settlements")
public class Settlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "settlement_number", unique = true, nullable = false, length = 50)
    private String settlementNumber;

    @Column(name = "reconciliation_id", nullable = false)
    private Long reconciliationId;

    @Column(name = "contract_id", nullable = false)
    private Long contractId;

    @Column(name = "contract_version_id", nullable = false)
    private Long contractVersionId;

    @Column(name = "reporting_period_start", nullable = false)
    private LocalDate reportingPeriodStart;

    @Column(name = "reporting_period_end", nullable = false)
    private LocalDate reportingPeriodEnd;

    @Column(name = "gross_box_office", nullable = false, precision = 14, scale = 2)
    private BigDecimal grossBoxOffice = BigDecimal.ZERO;

    @Column(name = "allowable_deductions", nullable = false, precision = 14, scale = 2)
    private BigDecimal allowableDeductions = BigDecimal.ZERO;

    @Column(name = "net_settlement_basis", nullable = false, precision = 14, scale = 2)
    private BigDecimal netSettlementBasis = BigDecimal.ZERO;

    @Column(name = "distributor_share_pct", nullable = false, precision = 5, scale = 2)
    private BigDecimal distributorSharePct = BigDecimal.ZERO;

    @Column(name = "distributor_settlement_amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal distributorSettlementAmount = BigDecimal.ZERO;

    @Column(name = "exhibitor_settlement_amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal exhibitorSettlementAmount = BigDecimal.ZERO;

    @Column(name = "adjustment_amount", precision = 14, scale = 2)
    private BigDecimal adjustmentAmount = BigDecimal.ZERO;

    @Column(name = "final_payable_amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal finalPayableAmount = BigDecimal.ZERO;

    @Column(name = "payable_to", length = 50)
    private String payableTo = "DISTRIBUTOR";

    @Column(nullable = false, length = 30)
    private String status = "DRAFT"; // DRAFT, PENDING_APPROVAL, APPROVED, DISPUTED, PAID

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "payment_reference", length = 100)
    private String paymentReference;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Settlement() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSettlementNumber() { return settlementNumber; }
    public void setSettlementNumber(String settlementNumber) { this.settlementNumber = settlementNumber; }

    public Long getReconciliationId() { return reconciliationId; }
    public void setReconciliationId(Long reconciliationId) { this.reconciliationId = reconciliationId; }

    public Long getContractId() { return contractId; }
    public void setContractId(Long contractId) { this.contractId = contractId; }

    public Long getContractVersionId() { return contractVersionId; }
    public void setContractVersionId(Long contractVersionId) { this.contractVersionId = contractVersionId; }

    public LocalDate getReportingPeriodStart() { return reportingPeriodStart; }
    public void setReportingPeriodStart(LocalDate reportingPeriodStart) { this.reportingPeriodStart = reportingPeriodStart; }

    public LocalDate getReportingPeriodEnd() { return reportingPeriodEnd; }
    public void setReportingPeriodEnd(LocalDate reportingPeriodEnd) { this.reportingPeriodEnd = reportingPeriodEnd; }

    public BigDecimal getGrossBoxOffice() { return grossBoxOffice; }
    public void setGrossBoxOffice(BigDecimal grossBoxOffice) { this.grossBoxOffice = grossBoxOffice; }

    public BigDecimal getAllowableDeductions() { return allowableDeductions; }
    public void setAllowableDeductions(BigDecimal allowableDeductions) { this.allowableDeductions = allowableDeductions; }

    public BigDecimal getNetSettlementBasis() { return netSettlementBasis; }
    public void setNetSettlementBasis(BigDecimal netSettlementBasis) { this.netSettlementBasis = netSettlementBasis; }

    public BigDecimal getDistributorSharePct() { return distributorSharePct; }
    public void setDistributorSharePct(BigDecimal distributorSharePct) { this.distributorSharePct = distributorSharePct; }

    public BigDecimal getDistributorSettlementAmount() { return distributorSettlementAmount; }
    public void setDistributorSettlementAmount(BigDecimal distributorSettlementAmount) { this.distributorSettlementAmount = distributorSettlementAmount; }

    public BigDecimal getExhibitorSettlementAmount() { return exhibitorSettlementAmount; }
    public void setExhibitorSettlementAmount(BigDecimal exhibitorSettlementAmount) { this.exhibitorSettlementAmount = exhibitorSettlementAmount; }

    public BigDecimal getAdjustmentAmount() { return adjustmentAmount; }
    public void setAdjustmentAmount(BigDecimal adjustmentAmount) { this.adjustmentAmount = adjustmentAmount; }

    public BigDecimal getFinalPayableAmount() { return finalPayableAmount; }
    public void setFinalPayableAmount(BigDecimal finalPayableAmount) { this.finalPayableAmount = finalPayableAmount; }

    public String getPayableTo() { return payableTo; }
    public void setPayableTo(String payableTo) { this.payableTo = payableTo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }

    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

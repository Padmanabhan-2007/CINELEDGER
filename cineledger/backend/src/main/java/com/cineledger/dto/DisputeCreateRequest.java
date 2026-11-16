package com.cineledger.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class DisputeCreateRequest {

    private Long discrepancyId;

    @NotNull(message = "Reconciliation ID is required")
    private Long reconciliationId;

    @NotBlank(message = "Dispute title is required")
    private String title;

    @NotBlank(message = "Dispute reason is required")
    private String reason;

    @NotNull(message = "Disputed amount is required")
    private BigDecimal disputedAmount;

    private BigDecimal proposedCorrection;

    public DisputeCreateRequest() {}

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
}

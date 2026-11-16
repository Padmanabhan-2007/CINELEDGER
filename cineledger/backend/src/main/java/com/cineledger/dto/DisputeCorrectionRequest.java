package com.cineledger.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class DisputeCorrectionRequest {

    private BigDecimal proposedCorrection;

    @NotBlank(message = "Resolution summary is required")
    private String resolutionSummary;

    @NotBlank(message = "Decision (RESOLVED or REJECTED) is required")
    private String decision; // RESOLVED, REJECTED

    public DisputeCorrectionRequest() {}

    public BigDecimal getProposedCorrection() { return proposedCorrection; }
    public void setProposedCorrection(BigDecimal proposedCorrection) { this.proposedCorrection = proposedCorrection; }

    public String getResolutionSummary() { return resolutionSummary; }
    public void setResolutionSummary(String resolutionSummary) { this.resolutionSummary = resolutionSummary; }

    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }
}

package com.cineledger.dto;

import com.cineledger.entity.DisputeComment;
import com.cineledger.entity.EvidenceAttachment;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class DisputeResponse {

    private Long id;
    private String disputeNumber;
    private Long discrepancyId;
    private String discrepancyCode;
    private String discrepancyType;
    private Long reconciliationId;
    private String reconciliationNumber;
    private String filmTitle;
    private String filmPosterUrl;
    private String cinemaName;
    private String title;
    private String reason;
    private BigDecimal disputedAmount;
    private BigDecimal proposedCorrection;
    private String status;
    private Long openedByUserId;
    private String openedByName;
    private String resolutionSummary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<DisputeComment> comments;
    private List<EvidenceAttachment> evidence;

    public DisputeResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDisputeNumber() { return disputeNumber; }
    public void setDisputeNumber(String disputeNumber) { this.disputeNumber = disputeNumber; }

    public Long getDiscrepancyId() { return discrepancyId; }
    public void setDiscrepancyId(Long discrepancyId) { this.discrepancyId = discrepancyId; }

    public String getDiscrepancyCode() { return discrepancyCode; }
    public void setDiscrepancyCode(String discrepancyCode) { this.discrepancyCode = discrepancyCode; }

    public String getDiscrepancyType() { return discrepancyType; }
    public void setDiscrepancyType(String discrepancyType) { this.discrepancyType = discrepancyType; }

    public Long getReconciliationId() { return reconciliationId; }
    public void setReconciliationId(Long reconciliationId) { this.reconciliationId = reconciliationId; }

    public String getReconciliationNumber() { return reconciliationNumber; }
    public void setReconciliationNumber(String reconciliationNumber) { this.reconciliationNumber = reconciliationNumber; }

    public String getFilmTitle() { return filmTitle; }
    public void setFilmTitle(String filmTitle) { this.filmTitle = filmTitle; }

    public String getFilmPosterUrl() { return filmPosterUrl; }
    public void setFilmPosterUrl(String filmPosterUrl) { this.filmPosterUrl = filmPosterUrl; }

    public String getCinemaName() { return cinemaName; }
    public void setCinemaName(String cinemaName) { this.cinemaName = cinemaName; }

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

    public String getOpenedByName() { return openedByName; }
    public void setOpenedByName(String openedByName) { this.openedByName = openedByName; }

    public String getResolutionSummary() { return resolutionSummary; }
    public void setResolutionSummary(String resolutionSummary) { this.resolutionSummary = resolutionSummary; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<DisputeComment> getComments() { return comments; }
    public void setComments(List<DisputeComment> comments) { this.comments = comments; }

    public List<EvidenceAttachment> getEvidence() { return evidence; }
    public void setEvidence(List<EvidenceAttachment> evidence) { this.evidence = evidence; }
}

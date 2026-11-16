package com.cineledger.dto;

import com.cineledger.entity.AuditEvent;
import java.math.BigDecimal;
import java.util.List;

public class DashboardSummaryDto {

    private long totalReconciliations;
    private long reconciledCount;
    private long openDiscrepanciesCount;
    private long pendingSettlementsCount;
    private BigDecimal totalSettlementAmount = BigDecimal.ZERO;
    private BigDecimal totalDisputedAmount = BigDecimal.ZERO;
    private String chainIntegrityStatus = "SECURE";
    private int auditChainLength;

    private List<FilmDto> recentFilms;
    private List<ReconciliationResponse> recentReconciliations;
    private List<SettlementCalculationResponse> pendingSettlements;
    private List<DisputeResponse> activeDisputes;
    private List<AuditEvent> recentAuditEvents;

    public DashboardSummaryDto() {}

    public long getTotalReconciliations() { return totalReconciliations; }
    public void setTotalReconciliations(long totalReconciliations) { this.totalReconciliations = totalReconciliations; }

    public long getReconciledCount() { return reconciledCount; }
    public void setReconciledCount(long reconciledCount) { this.reconciledCount = reconciledCount; }

    public long getOpenDiscrepanciesCount() { return openDiscrepanciesCount; }
    public void setOpenDiscrepanciesCount(long openDiscrepanciesCount) { this.openDiscrepanciesCount = openDiscrepanciesCount; }

    public long getPendingSettlementsCount() { return pendingSettlementsCount; }
    public void setPendingSettlementsCount(long pendingSettlementsCount) { this.pendingSettlementsCount = pendingSettlementsCount; }

    public BigDecimal getTotalSettlementAmount() { return totalSettlementAmount; }
    public void setTotalSettlementAmount(BigDecimal totalSettlementAmount) { this.totalSettlementAmount = totalSettlementAmount; }

    public BigDecimal getTotalDisputedAmount() { return totalDisputedAmount; }
    public void setTotalDisputedAmount(BigDecimal totalDisputedAmount) { this.totalDisputedAmount = totalDisputedAmount; }

    public String getChainIntegrityStatus() { return chainIntegrityStatus; }
    public void setChainIntegrityStatus(String chainIntegrityStatus) { this.chainIntegrityStatus = chainIntegrityStatus; }

    public int getAuditChainLength() { return auditChainLength; }
    public void setAuditChainLength(int auditChainLength) { this.auditChainLength = auditChainLength; }

    public List<FilmDto> getRecentFilms() { return recentFilms; }
    public void setRecentFilms(List<FilmDto> recentFilms) { this.recentFilms = recentFilms; }

    public List<ReconciliationResponse> getRecentReconciliations() { return recentReconciliations; }
    public void setRecentReconciliations(List<ReconciliationResponse> recentReconciliations) { this.recentReconciliations = recentReconciliations; }

    public List<SettlementCalculationResponse> getPendingSettlements() { return pendingSettlements; }
    public void setPendingSettlements(List<SettlementCalculationResponse> pendingSettlements) { this.pendingSettlements = pendingSettlements; }

    public List<DisputeResponse> getActiveDisputes() { return activeDisputes; }
    public void setActiveDisputes(List<DisputeResponse> activeDisputes) { this.activeDisputes = activeDisputes; }

    public List<AuditEvent> getRecentAuditEvents() { return recentAuditEvents; }
    public void setRecentAuditEvents(List<AuditEvent> recentAuditEvents) { this.recentAuditEvents = recentAuditEvents; }
}

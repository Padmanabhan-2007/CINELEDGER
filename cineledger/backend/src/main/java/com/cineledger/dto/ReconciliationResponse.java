package com.cineledger.dto;

import com.cineledger.entity.Discrepancy;
import com.cineledger.entity.Reconciliation;
import com.cineledger.entity.SourceReport;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ReconciliationResponse {

    private Long id;
    private String reconciliationNumber;
    private Long filmId;
    private String filmTitle;
    private String filmPosterUrl;
    private Long cinemaId;
    private String cinemaName;
    private String cinemaCircuit;
    private String cinemaCity;
    private Long contractId;
    private String contractNumber;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private String status;
    private BigDecimal totalPosAmount;
    private BigDecimal totalDistributorAmount;
    private BigDecimal totalVariance;
    private Integer transactionCount;
    private Integer matchedCount;
    private Integer discrepancyCount;
    private String notes;
    private Long runByUserId;
    private String runByUserName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<SourceReport> sourceReports;
    private List<Discrepancy> discrepancies;
    private Long settlementId;
    private String settlementNumber;

    public ReconciliationResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReconciliationNumber() { return reconciliationNumber; }
    public void setReconciliationNumber(String reconciliationNumber) { this.reconciliationNumber = reconciliationNumber; }

    public Long getFilmId() { return filmId; }
    public void setFilmId(Long filmId) { this.filmId = filmId; }

    public String getFilmTitle() { return filmTitle; }
    public void setFilmTitle(String filmTitle) { this.filmTitle = filmTitle; }

    public String getFilmPosterUrl() { return filmPosterUrl; }
    public void setFilmPosterUrl(String filmPosterUrl) { this.filmPosterUrl = filmPosterUrl; }

    public Long getCinemaId() { return cinemaId; }
    public void setCinemaId(Long cinemaId) { this.cinemaId = cinemaId; }

    public String getCinemaName() { return cinemaName; }
    public void setCinemaName(String cinemaName) { this.cinemaName = cinemaName; }

    public String getCinemaCircuit() { return cinemaCircuit; }
    public void setCinemaCircuit(String cinemaCircuit) { this.cinemaCircuit = cinemaCircuit; }

    public String getCinemaCity() { return cinemaCity; }
    public void setCinemaCity(String cinemaCity) { this.cinemaCity = cinemaCity; }

    public Long getContractId() { return contractId; }
    public void setContractId(Long contractId) { this.contractId = contractId; }

    public String getContractNumber() { return contractNumber; }
    public void setContractNumber(String contractNumber) { this.contractNumber = contractNumber; }

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

    public String getRunByUserName() { return runByUserName; }
    public void setRunByUserName(String runByUserName) { this.runByUserName = runByUserName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<SourceReport> getSourceReports() { return sourceReports; }
    public void setSourceReports(List<SourceReport> sourceReports) { this.sourceReports = sourceReports; }

    public List<Discrepancy> getDiscrepancies() { return discrepancies; }
    public void setDiscrepancies(List<Discrepancy> discrepancies) { this.discrepancies = discrepancies; }

    public Long getSettlementId() { return settlementId; }
    public void setSettlementId(Long settlementId) { this.settlementId = settlementId; }

    public String getSettlementNumber() { return settlementNumber; }
    public void setSettlementNumber(String settlementNumber) { this.settlementNumber = settlementNumber; }
}

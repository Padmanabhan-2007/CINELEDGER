package com.cineledger.dto;

import com.cineledger.entity.Settlement;
import com.cineledger.entity.SettlementLineItem;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class SettlementCalculationResponse {

    private Long id;
    private String settlementNumber;
    private Long reconciliationId;
    private String reconciliationNumber;
    private Long contractId;
    private String contractNumber;
    private Long contractVersionId;
    private Integer contractVersionNumber;
    private String filmTitle;
    private String filmPosterUrl;
    private String cinemaName;
    private String circuitName;
    private String distributorName;
    private String exhibitorName;
    private LocalDate reportingPeriodStart;
    private LocalDate reportingPeriodEnd;

    private BigDecimal grossBoxOffice;
    private BigDecimal allowableDeductions;
    private BigDecimal netSettlementBasis;
    private BigDecimal distributorSharePct;
    private BigDecimal distributorSettlementAmount;
    private BigDecimal exhibitorSettlementAmount;
    private BigDecimal adjustmentAmount;
    private BigDecimal finalPayableAmount;
    private String payableTo;
    private String status;
    private String approvedBy;
    private LocalDateTime approvedAt;
    private String paymentReference;
    private String calculationExplanation;

    private List<SettlementLineItem> lineItems;

    public SettlementCalculationResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSettlementNumber() { return settlementNumber; }
    public void setSettlementNumber(String settlementNumber) { this.settlementNumber = settlementNumber; }

    public Long getReconciliationId() { return reconciliationId; }
    public void setReconciliationId(Long reconciliationId) { this.reconciliationId = reconciliationId; }

    public String getReconciliationNumber() { return reconciliationNumber; }
    public void setReconciliationNumber(String reconciliationNumber) { this.reconciliationNumber = reconciliationNumber; }

    public Long getContractId() { return contractId; }
    public void setContractId(Long contractId) { this.contractId = contractId; }

    public String getContractNumber() { return contractNumber; }
    public void setContractNumber(String contractNumber) { this.contractNumber = contractNumber; }

    public Long getContractVersionId() { return contractVersionId; }
    public void setContractVersionId(Long contractVersionId) { this.contractVersionId = contractVersionId; }

    public Integer getContractVersionNumber() { return contractVersionNumber; }
    public void setContractVersionNumber(Integer contractVersionNumber) { this.contractVersionNumber = contractVersionNumber; }

    public String getFilmTitle() { return filmTitle; }
    public void setFilmTitle(String filmTitle) { this.filmTitle = filmTitle; }

    public String getFilmPosterUrl() { return filmPosterUrl; }
    public void setFilmPosterUrl(String filmPosterUrl) { this.filmPosterUrl = filmPosterUrl; }

    public String getCinemaName() { return cinemaName; }
    public void setCinemaName(String cinemaName) { this.cinemaName = cinemaName; }

    public String getCircuitName() { return circuitName; }
    public void setCircuitName(String circuitName) { this.circuitName = circuitName; }

    public String getDistributorName() { return distributorName; }
    public void setDistributorName(String distributorName) { this.distributorName = distributorName; }

    public String getExhibitorName() { return exhibitorName; }
    public void setExhibitorName(String exhibitorName) { this.exhibitorName = exhibitorName; }

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

    public String getCalculationExplanation() { return calculationExplanation; }
    public void setCalculationExplanation(String calculationExplanation) { this.calculationExplanation = calculationExplanation; }

    public List<SettlementLineItem> getLineItems() { return lineItems; }
    public void setLineItems(List<SettlementLineItem> lineItems) { this.lineItems = lineItems; }
}

package com.cineledger.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ContractDto {

    private Long id;

    @NotBlank(message = "Contract number is required")
    private String contractNumber;

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Film ID is required")
    private Long filmId;
    private String filmTitle;

    @NotNull(message = "Distributor ID is required")
    private Long distributorId;
    private String distributorName;

    @NotNull(message = "Exhibitor ID is required")
    private Long exhibitorId;
    private String exhibitorName;

    private String settlementBasis;
    private String status;

    // Active version terms
    private Integer activeVersionNumber;
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;
    private BigDecimal distributorSharePercentage;
    private BigDecimal exhibitorSharePercentage;
    private BigDecimal convenienceFeeDeductionPct;
    private BigDecimal virtualPrintFeePerShow;
    private BigDecimal taxRatePercentage;
    private String termsSummary;

    public ContractDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContractNumber() { return contractNumber; }
    public void setContractNumber(String contractNumber) { this.contractNumber = contractNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Long getFilmId() { return filmId; }
    public void setFilmId(Long filmId) { this.filmId = filmId; }

    public String getFilmTitle() { return filmTitle; }
    public void setFilmTitle(String filmTitle) { this.filmTitle = filmTitle; }

    public Long getDistributorId() { return distributorId; }
    public void setDistributorId(Long distributorId) { this.distributorId = distributorId; }

    public String getDistributorName() { return distributorName; }
    public void setDistributorName(String distributorName) { this.distributorName = distributorName; }

    public Long getExhibitorId() { return exhibitorId; }
    public void setExhibitorId(Long exhibitorId) { this.exhibitorId = exhibitorId; }

    public String getExhibitorName() { return exhibitorName; }
    public void setExhibitorName(String exhibitorName) { this.exhibitorName = exhibitorName; }

    public String getSettlementBasis() { return settlementBasis; }
    public void setSettlementBasis(String settlementBasis) { this.settlementBasis = settlementBasis; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getActiveVersionNumber() { return activeVersionNumber; }
    public void setActiveVersionNumber(Integer activeVersionNumber) { this.activeVersionNumber = activeVersionNumber; }

    public LocalDate getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(LocalDate effectiveFrom) { this.effectiveFrom = effectiveFrom; }

    public LocalDate getEffectiveTo() { return effectiveTo; }
    public void setEffectiveTo(LocalDate effectiveTo) { this.effectiveTo = effectiveTo; }

    public BigDecimal getDistributorSharePercentage() { return distributorSharePercentage; }
    public void setDistributorSharePercentage(BigDecimal distributorSharePercentage) { this.distributorSharePercentage = distributorSharePercentage; }

    public BigDecimal getExhibitorSharePercentage() { return exhibitorSharePercentage; }
    public void setExhibitorSharePercentage(BigDecimal exhibitorSharePercentage) { this.exhibitorSharePercentage = exhibitorSharePercentage; }

    public BigDecimal getConvenienceFeeDeductionPct() { return convenienceFeeDeductionPct; }
    public void setConvenienceFeeDeductionPct(BigDecimal convenienceFeeDeductionPct) { this.convenienceFeeDeductionPct = convenienceFeeDeductionPct; }

    public BigDecimal getVirtualPrintFeePerShow() { return virtualPrintFeePerShow; }
    public void setVirtualPrintFeePerShow(BigDecimal virtualPrintFeePerShow) { this.virtualPrintFeePerShow = virtualPrintFeePerShow; }

    public BigDecimal getTaxRatePercentage() { return taxRatePercentage; }
    public void setTaxRatePercentage(BigDecimal taxRatePercentage) { this.taxRatePercentage = taxRatePercentage; }

    public String getTermsSummary() { return termsSummary; }
    public void setTermsSummary(String termsSummary) { this.termsSummary = termsSummary; }
}

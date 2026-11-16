package com.cineledger.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "contract_versions")
public class ContractVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contract_id", nullable = false)
    private Long contractId;

    @Column(name = "version_number", nullable = false)
    private Integer versionNumber = 1;

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo;

    @Column(name = "distributor_share_pct", nullable = false, precision = 5, scale = 2)
    private BigDecimal distributorSharePercentage;

    @Column(name = "exhibitor_share_pct", nullable = false, precision = 5, scale = 2)
    private BigDecimal exhibitorSharePercentage;

    @Column(name = "convenience_fee_deduction_pct", precision = 5, scale = 2)
    private BigDecimal convenienceFeeDeductionPct = BigDecimal.ZERO;

    @Column(name = "vpf_per_show", precision = 10, scale = 2)
    private BigDecimal virtualPrintFeePerShow = BigDecimal.ZERO;

    @Column(name = "tax_rate_pct", precision = 5, scale = 2)
    private BigDecimal taxRatePercentage = BigDecimal.ZERO;

    @Column(name = "terms_summary", columnDefinition = "TEXT")
    private String termsSummary;

    @Column(name = "is_active", nullable = false)
    private Boolean active = true;

    public ContractVersion() {}

    public ContractVersion(Long contractId, Integer versionNumber, LocalDate effectiveFrom, LocalDate effectiveTo,
                           BigDecimal distributorSharePercentage, BigDecimal exhibitorSharePercentage,
                           BigDecimal convenienceFeeDeductionPct, BigDecimal virtualPrintFeePerShow,
                           BigDecimal taxRatePercentage, String termsSummary, Boolean active) {
        this.contractId = contractId;
        this.versionNumber = versionNumber;
        this.effectiveFrom = effectiveFrom;
        this.effectiveTo = effectiveTo;
        this.distributorSharePercentage = distributorSharePercentage;
        this.exhibitorSharePercentage = exhibitorSharePercentage;
        this.convenienceFeeDeductionPct = convenienceFeeDeductionPct != null ? convenienceFeeDeductionPct : BigDecimal.ZERO;
        this.virtualPrintFeePerShow = virtualPrintFeePerShow != null ? virtualPrintFeePerShow : BigDecimal.ZERO;
        this.taxRatePercentage = taxRatePercentage != null ? taxRatePercentage : BigDecimal.ZERO;
        this.termsSummary = termsSummary;
        this.active = active != null ? active : true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getContractId() { return contractId; }
    public void setContractId(Long contractId) { this.contractId = contractId; }

    public Integer getVersionNumber() { return versionNumber; }
    public void setVersionNumber(Integer versionNumber) { this.versionNumber = versionNumber; }

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

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}

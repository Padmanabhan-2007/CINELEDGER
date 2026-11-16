package com.cineledger.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "settlement_line_items")
public class SettlementLineItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "settlement_id", nullable = false)
    private Long settlementId;

    @Column(name = "item_order", nullable = false)
    private Integer itemOrder = 1;

    @Column(name = "line_item_type", nullable = false, length = 50)
    private String lineItemType; // GROSS_REVENUE, TAX_DEDUCTION, VPF_DEDUCTION, CONVENIENCE_ADJUSTMENT, DISTRIBUTOR_SHARE, EXHIBITOR_SHARE, DISCREPANCY_ADJUSTMENT

    @Column(nullable = false, length = 200)
    private String description;

    @Column(name = "basis_amount", precision = 14, scale = 2)
    private BigDecimal basisAmount = BigDecimal.ZERO;

    @Column(name = "rate_or_percentage", precision = 8, scale = 4)
    private BigDecimal rateOrPercentage = BigDecimal.ZERO;

    @Column(name = "calculated_amount", nullable = false, precision = 14, scale = 2)
    private BigDecimal calculatedAmount = BigDecimal.ZERO;

    public SettlementLineItem() {}

    public SettlementLineItem(Long settlementId, Integer itemOrder, String lineItemType, String description,
                              BigDecimal basisAmount, BigDecimal rateOrPercentage, BigDecimal calculatedAmount) {
        this.settlementId = settlementId;
        this.itemOrder = itemOrder;
        this.lineItemType = lineItemType;
        this.description = description;
        this.basisAmount = basisAmount != null ? basisAmount : BigDecimal.ZERO;
        this.rateOrPercentage = rateOrPercentage != null ? rateOrPercentage : BigDecimal.ZERO;
        this.calculatedAmount = calculatedAmount != null ? calculatedAmount : BigDecimal.ZERO;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSettlementId() { return settlementId; }
    public void setSettlementId(Long settlementId) { this.settlementId = settlementId; }

    public Integer getItemOrder() { return itemOrder; }
    public void setItemOrder(Integer itemOrder) { this.itemOrder = itemOrder; }

    public String getLineItemType() { return lineItemType; }
    public void setLineItemType(String lineItemType) { this.lineItemType = lineItemType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getBasisAmount() { return basisAmount; }
    public void setBasisAmount(BigDecimal basisAmount) { this.basisAmount = basisAmount; }

    public BigDecimal getRateOrPercentage() { return rateOrPercentage; }
    public void setRateOrPercentage(BigDecimal rateOrPercentage) { this.rateOrPercentage = rateOrPercentage; }

    public BigDecimal getCalculatedAmount() { return calculatedAmount; }
    public void setCalculatedAmount(BigDecimal calculatedAmount) { this.calculatedAmount = calculatedAmount; }
}

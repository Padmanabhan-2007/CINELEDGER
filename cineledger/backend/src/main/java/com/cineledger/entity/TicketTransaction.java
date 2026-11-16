package com.cineledger.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "ticket_transactions", indexes = {
    @Index(name = "idx_recon_txref", columnList = "reconciliation_id, transaction_ref"),
    @Index(name = "idx_source_report", columnList = "source_report_id")
})
public class TicketTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_report_id", nullable = false)
    private Long sourceReportId;

    @Column(name = "reconciliation_id", nullable = false)
    private Long reconciliationId;

    @Column(name = "source_type", nullable = false, length = 50)
    private String sourceType; // THEATRE_POS, DISTRIBUTOR_STATEMENT, TICKETING_PLATFORM

    @Column(name = "transaction_ref", nullable = false, length = 100)
    private String transactionRef;

    @Column(name = "show_date")
    private LocalDate showDate;

    @Column(name = "show_time")
    private LocalTime showTime;

    @Column(name = "screen_name", length = 50)
    private String screenName;

    @Column(name = "ticket_category", length = 50)
    private String ticketCategory; // Standard, Gold, Recliner, IMAX

    @Column(name = "quantity")
    private Integer quantity = 1;

    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice = BigDecimal.ZERO;

    @Column(name = "gross_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal grossAmount = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 12, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "refund_amount", precision = 12, scale = 2)
    private BigDecimal refundAmount = BigDecimal.ZERO;

    @Column(name = "net_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal netAmount = BigDecimal.ZERO;

    @Column(name = "comp_tickets")
    private Integer compTickets = 0;

    @Column(length = 10)
    private String currency = "INR";

    public TicketTransaction() {}

    public TicketTransaction(Long sourceReportId, Long reconciliationId, String sourceType, String transactionRef,
                             LocalDate showDate, LocalTime showTime, String screenName, String ticketCategory,
                             Integer quantity, BigDecimal unitPrice, BigDecimal grossAmount, BigDecimal discountAmount,
                             BigDecimal refundAmount, BigDecimal netAmount, Integer compTickets, String currency) {
        this.sourceReportId = sourceReportId;
        this.reconciliationId = reconciliationId;
        this.sourceType = sourceType;
        this.transactionRef = transactionRef;
        this.showDate = showDate;
        this.showTime = showTime;
        this.screenName = screenName;
        this.ticketCategory = ticketCategory;
        this.quantity = quantity != null ? quantity : 1;
        this.unitPrice = unitPrice != null ? unitPrice : BigDecimal.ZERO;
        this.grossAmount = grossAmount != null ? grossAmount : BigDecimal.ZERO;
        this.discountAmount = discountAmount != null ? discountAmount : BigDecimal.ZERO;
        this.refundAmount = refundAmount != null ? refundAmount : BigDecimal.ZERO;
        this.netAmount = netAmount != null ? netAmount : BigDecimal.ZERO;
        this.compTickets = compTickets != null ? compTickets : 0;
        this.currency = currency != null ? currency : "INR";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSourceReportId() { return sourceReportId; }
    public void setSourceReportId(Long sourceReportId) { this.sourceReportId = sourceReportId; }

    public Long getReconciliationId() { return reconciliationId; }
    public void setReconciliationId(Long reconciliationId) { this.reconciliationId = reconciliationId; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }

    public LocalDate getShowDate() { return showDate; }
    public void setShowDate(LocalDate showDate) { this.showDate = showDate; }

    public LocalTime getShowTime() { return showTime; }
    public void setShowTime(LocalTime showTime) { this.showTime = showTime; }

    public String getScreenName() { return screenName; }
    public void setScreenName(String screenName) { this.screenName = screenName; }

    public String getTicketCategory() { return ticketCategory; }
    public void setTicketCategory(String ticketCategory) { this.ticketCategory = ticketCategory; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getGrossAmount() { return grossAmount; }
    public void setGrossAmount(BigDecimal grossAmount) { this.grossAmount = grossAmount; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getRefundAmount() { return refundAmount; }
    public void setRefundAmount(BigDecimal refundAmount) { this.refundAmount = refundAmount; }

    public BigDecimal getNetAmount() { return netAmount; }
    public void setNetAmount(BigDecimal netAmount) { this.netAmount = netAmount; }

    public Integer getCompTickets() { return compTickets; }
    public void setCompTickets(Integer compTickets) { this.compTickets = compTickets; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}

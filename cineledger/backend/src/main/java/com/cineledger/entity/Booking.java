package com.cineledger.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings", indexes = {
    @Index(name = "idx_booking_ref", columnList = "booking_reference", unique = true),
    @Index(name = "idx_booking_user", columnList = "user_id"),
    @Index(name = "idx_booking_showtime", columnList = "showtime_id")
})
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_reference", nullable = false, unique = true, length = 30)
    private String bookingReference; // e.g. CNH-2026-891024

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "showtime_id", nullable = false)
    private Long showtimeId;

    @Column(name = "seat_count", nullable = false)
    private Integer seatCount = 1;

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "gst_tax", nullable = false, precision = 10, scale = 2)
    private BigDecimal gstTax;

    @Column(name = "convenience_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal convenienceFee;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "HELD"; // HELD, CONFIRMED, CANCELLED, REFUNDED

    @Column(name = "payment_reference", length = 100)
    private String paymentReference;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod = "UPI"; // UPI, CARD, NET_BANKING

    @Column(name = "qr_code_data", length = 500)
    private String qrCodeData;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    public Booking() {}

    public Booking(String bookingReference, Long userId, Long showtimeId, Integer seatCount,
                   BigDecimal subtotal, BigDecimal gstTax, BigDecimal convenienceFee, BigDecimal totalAmount,
                   String status, String paymentReference, String paymentMethod, String qrCodeData) {
        this.bookingReference = bookingReference;
        this.userId = userId;
        this.showtimeId = showtimeId;
        this.seatCount = seatCount != null ? seatCount : 1;
        this.subtotal = subtotal;
        this.gstTax = gstTax != null ? gstTax : BigDecimal.ZERO;
        this.convenienceFee = convenienceFee != null ? convenienceFee : BigDecimal.ZERO;
        this.totalAmount = totalAmount;
        this.status = status != null ? status : "HELD";
        this.paymentReference = paymentReference;
        this.paymentMethod = paymentMethod != null ? paymentMethod : "UPI";
        this.qrCodeData = qrCodeData;
        this.createdAt = LocalDateTime.now();
        if ("CONFIRMED".equals(status)) {
            this.confirmedAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getShowtimeId() { return showtimeId; }
    public void setShowtimeId(Long showtimeId) { this.showtimeId = showtimeId; }

    public Integer getSeatCount() { return seatCount; }
    public void setSeatCount(Integer seatCount) { this.seatCount = seatCount; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getGstTax() { return gstTax; }
    public void setGstTax(BigDecimal gstTax) { this.gstTax = gstTax; }

    public BigDecimal getConvenienceFee() { return convenienceFee; }
    public void setConvenienceFee(BigDecimal convenienceFee) { this.convenienceFee = convenienceFee; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getQrCodeData() { return qrCodeData; }
    public void setQrCodeData(String qrCodeData) { this.qrCodeData = qrCodeData; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getConfirmedAt() { return confirmedAt; }
    public void setConfirmedAt(LocalDateTime confirmedAt) { this.confirmedAt = confirmedAt; }
}


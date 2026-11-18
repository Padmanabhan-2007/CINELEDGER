package com.cineledger.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings", indexes = {
    @Index(name = "idx_booking_ref", columnList = "booking_reference", unique = true),
    @Index(name = "idx_booking_user", columnList = "user_id"),
    @Index(name = "idx_booking_cnh_user", columnList = "cinemaholic_user_id"),
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

    @Column(name = "cinemaholic_user_id")
    private Long cinemaholicUserId;

    @Column(name = "customer_name", length = 120)
    private String customerName;

    @Column(name = "customer_email", length = 120)
    private String customerEmail;

    @Column(name = "customer_phone", length = 30)
    private String customerPhone;

    @Column(name = "showtime_id", nullable = false)
    private Long showtimeId;

    @Column(name = "film_id")
    private Long filmId;

    @Column(name = "film_title", length = 150)
    private String filmTitle;

    @Column(name = "cinema_id")
    private Long cinemaId;

    @Column(name = "cinema_name", length = 150)
    private String cinemaName;

    @Column(name = "screen_id")
    private Long screenId;

    @Column(name = "screen_name", length = 100)
    private String screenName;

    @Column(name = "screen_format", length = 50)
    private String screenFormat;

    @Column(name = "show_date")
    private LocalDate showDate;

    @Column(name = "show_time")
    private LocalTime showTime;

    @Column(name = "show_day_of_week", length = 30)
    private String showDayOfWeek; // e.g. "MONDAY", "TUESDAY", "SATURDAY"

    @Column(name = "show_time_formatted", length = 30)
    private String showTimeFormatted; // e.g. "06:45 PM"

    @Column(name = "seat_codes", length = 200)
    private String seatCodes; // e.g. "H7, H8"

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

    public Long getCinemaholicUserId() { return cinemaholicUserId; }
    public void setCinemaholicUserId(Long cinemaholicUserId) { this.cinemaholicUserId = cinemaholicUserId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public Long getShowtimeId() { return showtimeId; }
    public void setShowtimeId(Long showtimeId) { this.showtimeId = showtimeId; }

    public Long getFilmId() { return filmId; }
    public void setFilmId(Long filmId) { this.filmId = filmId; }

    public String getFilmTitle() { return filmTitle; }
    public void setFilmTitle(String filmTitle) { this.filmTitle = filmTitle; }

    public Long getCinemaId() { return cinemaId; }
    public void setCinemaId(Long cinemaId) { this.cinemaId = cinemaId; }

    public String getCinemaName() { return cinemaName; }
    public void setCinemaName(String cinemaName) { this.cinemaName = cinemaName; }

    public Long getScreenId() { return screenId; }
    public void setScreenId(Long screenId) { this.screenId = screenId; }

    public String getScreenName() { return screenName; }
    public void setScreenName(String screenName) { this.screenName = screenName; }

    public String getScreenFormat() { return screenFormat; }
    public void setScreenFormat(String screenFormat) { this.screenFormat = screenFormat; }

    public LocalDate getShowDate() { return showDate; }
    public void setShowDate(LocalDate showDate) { this.showDate = showDate; }

    public LocalTime getShowTime() { return showTime; }
    public void setShowTime(LocalTime showTime) { this.showTime = showTime; }

    public String getShowDayOfWeek() { return showDayOfWeek; }
    public void setShowDayOfWeek(String showDayOfWeek) { this.showDayOfWeek = showDayOfWeek; }

    public String getShowTimeFormatted() { return showTimeFormatted; }
    public void setShowTimeFormatted(String showTimeFormatted) { this.showTimeFormatted = showTimeFormatted; }

    public String getSeatCodes() { return seatCodes; }
    public void setSeatCodes(String seatCodes) { this.seatCodes = seatCodes; }

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

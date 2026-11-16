package com.cineledger.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class SeatHoldResponse {

    private String holdToken;
    private Long showtimeId;
    private List<Long> seatIds;
    private List<String> seatCodes;
    private LocalDateTime expiresAt;
    private long expiresInSeconds;
    private BigDecimal subtotal;
    private BigDecimal gstTax;
    private BigDecimal convenienceFee;
    private BigDecimal totalAmount;

    public SeatHoldResponse() {}

    public String getHoldToken() { return holdToken; }
    public void setHoldToken(String holdToken) { this.holdToken = holdToken; }

    public Long getShowtimeId() { return showtimeId; }
    public void setShowtimeId(Long showtimeId) { this.showtimeId = showtimeId; }

    public List<Long> getSeatIds() { return seatIds; }
    public void setSeatIds(List<Long> seatIds) { this.seatIds = seatIds; }

    public List<String> getSeatCodes() { return seatCodes; }
    public void setSeatCodes(List<String> seatCodes) { this.seatCodes = seatCodes; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public long getExpiresInSeconds() { return expiresInSeconds; }
    public void setExpiresInSeconds(long expiresInSeconds) { this.expiresInSeconds = expiresInSeconds; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getGstTax() { return gstTax; }
    public void setGstTax(BigDecimal gstTax) { this.gstTax = gstTax; }

    public BigDecimal getConvenienceFee() { return convenienceFee; }
    public void setConvenienceFee(BigDecimal convenienceFee) { this.convenienceFee = convenienceFee; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}


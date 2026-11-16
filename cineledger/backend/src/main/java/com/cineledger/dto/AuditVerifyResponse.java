package com.cineledger.dto;

import java.time.LocalDateTime;

public class AuditVerifyResponse {

    private boolean valid;
    private int totalEvents;
    private Long brokenEventId;
    private Long brokenSequenceNumber;
    private String message;
    private LocalDateTime verifiedAt;

    public AuditVerifyResponse() {
        this.verifiedAt = LocalDateTime.now();
    }

    public AuditVerifyResponse(boolean valid, int totalEvents, Long brokenEventId, Long brokenSequenceNumber, String message) {
        this.valid = valid;
        this.totalEvents = totalEvents;
        this.brokenEventId = brokenEventId;
        this.brokenSequenceNumber = brokenSequenceNumber;
        this.message = message;
        this.verifiedAt = LocalDateTime.now();
    }

    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }

    public int getTotalEvents() { return totalEvents; }
    public void setTotalEvents(int totalEvents) { this.totalEvents = totalEvents; }

    public Long getBrokenEventId() { return brokenEventId; }
    public void setBrokenEventId(Long brokenEventId) { this.brokenEventId = brokenEventId; }

    public Long getBrokenSequenceNumber() { return brokenSequenceNumber; }
    public void setBrokenSequenceNumber(Long brokenSequenceNumber) { this.brokenSequenceNumber = brokenSequenceNumber; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }
}

package com.cineledger.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "source_reports")
public class SourceReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reconciliation_id", nullable = false)
    private Long reconciliationId;

    @Column(name = "report_type", nullable = false, length = 50)
    private String reportType; // THEATRE_POS, DISTRIBUTOR_STATEMENT, TICKETING_PLATFORM

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Column(name = "record_count")
    private Integer recordCount = 0;

    @Column(name = "total_gross_amount", precision = 14, scale = 2)
    private BigDecimal totalGrossAmount = BigDecimal.ZERO;

    @Column(name = "total_refund_amount", precision = 14, scale = 2)
    private BigDecimal totalRefundAmount = BigDecimal.ZERO;

    @Column(name = "total_net_amount", precision = 14, scale = 2)
    private BigDecimal totalNetAmount = BigDecimal.ZERO;

    @Column(name = "uploaded_by", length = 100)
    private String uploadedBy;

    @Column(nullable = false, length = 30)
    private String status = "PARSED"; // PARSED, FAILED

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public SourceReport() {}

    public SourceReport(Long reconciliationId, String reportType, String fileName, int recordCount, BigDecimal totalGrossAmount, String rawPayload) {
        this(reconciliationId, reportType, fileName, 1024L, recordCount, totalGrossAmount, BigDecimal.ZERO, totalGrossAmount, "system", "PARSED");
    }

    public SourceReport(Long reconciliationId, String reportType, String fileName, Long fileSizeBytes,
                        Integer recordCount, BigDecimal totalGrossAmount, BigDecimal totalRefundAmount,
                        BigDecimal totalNetAmount, String uploadedBy, String status) {
        this.reconciliationId = reconciliationId;
        this.reportType = reportType;
        this.fileName = fileName;
        this.fileSizeBytes = fileSizeBytes;
        this.recordCount = recordCount != null ? recordCount : 0;
        this.totalGrossAmount = totalGrossAmount != null ? totalGrossAmount : BigDecimal.ZERO;
        this.totalRefundAmount = totalRefundAmount != null ? totalRefundAmount : BigDecimal.ZERO;
        this.totalNetAmount = totalNetAmount != null ? totalNetAmount : BigDecimal.ZERO;
        this.uploadedBy = uploadedBy;
        this.status = status != null ? status : "PARSED";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getReconciliationId() { return reconciliationId; }
    public void setReconciliationId(Long reconciliationId) { this.reconciliationId = reconciliationId; }

    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public Long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }

    public Integer getRecordCount() { return recordCount; }
    public void setRecordCount(Integer recordCount) { this.recordCount = recordCount; }

    public BigDecimal getTotalGrossAmount() { return totalGrossAmount; }
    public void setTotalGrossAmount(BigDecimal totalGrossAmount) { this.totalGrossAmount = totalGrossAmount; }

    public BigDecimal getTotalRefundAmount() { return totalRefundAmount; }
    public void setTotalRefundAmount(BigDecimal totalRefundAmount) { this.totalRefundAmount = totalRefundAmount; }

    public BigDecimal getTotalNetAmount() { return totalNetAmount; }
    public void setTotalNetAmount(BigDecimal totalNetAmount) { this.totalNetAmount = totalNetAmount; }

    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

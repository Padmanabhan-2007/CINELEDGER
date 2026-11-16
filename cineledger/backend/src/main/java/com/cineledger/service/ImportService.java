package com.cineledger.service;

import com.cineledger.entity.Reconciliation;
import com.cineledger.entity.SourceReport;
import com.cineledger.entity.TicketTransaction;
import com.cineledger.exception.BadRequestException;
import com.cineledger.exception.ResourceNotFoundException;
import com.cineledger.repository.ReconciliationRepository;
import com.cineledger.repository.SourceReportRepository;
import com.cineledger.repository.TicketTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ImportService {

    private final SourceReportRepository sourceReportRepository;
    private final TicketTransactionRepository ticketTransactionRepository;
    private final ReconciliationRepository reconciliationRepository;
    private final AuditService auditService;

    public ImportService(SourceReportRepository sourceReportRepository,
                         TicketTransactionRepository ticketTransactionRepository,
                         ReconciliationRepository reconciliationRepository,
                         AuditService auditService) {
        this.sourceReportRepository = sourceReportRepository;
        this.ticketTransactionRepository = ticketTransactionRepository;
        this.reconciliationRepository = reconciliationRepository;
        this.auditService = auditService;
    }

    public List<SourceReport> getReportsForReconciliation(Long reconciliationId) {
        return sourceReportRepository.findByReconciliationId(reconciliationId);
    }

    @Transactional
    public Map<String, Object> importCsvReport(Long reconciliationId, String reportType, MultipartFile file,
                                              String actorUsername, String actorRole) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded CSV file cannot be empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".csv")) {
            throw new BadRequestException("Invalid file format. Only standard .csv files are supported.");
        }

        Reconciliation reconciliation = reconciliationRepository.findById(reconciliationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reconciliation not found with id: " + reconciliationId));

        String sanitizedReportType = (reportType != null && !reportType.isBlank())
                ? reportType.trim().toUpperCase() : "THEATRE_POS";

        List<TicketTransaction> transactions = new ArrayList<>();
        Set<String> seenRefsInFile = new HashSet<>();
        List<String> duplicateRefs = new ArrayList<>();
        List<String> invalidRowErrors = new ArrayList<>();

        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalRefund = BigDecimal.ZERO;
        BigDecimal totalNet = BigDecimal.ZERO;

        int rowNumber = 1;

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String headerLine = reader.readLine();
            if (headerLine == null || headerLine.isBlank()) {
                throw new BadRequestException("CSV file contains no headers or data rows");
            }

            String[] rawHeaders = headerLine.split(",");
            Map<String, Integer> colMap = new HashMap<>();
            for (int i = 0; i < rawHeaders.length; i++) {
                colMap.put(rawHeaders[i].trim().toLowerCase().replace("\"", ""), i);
            }

            // Verify essential header presence
            if (!colMap.containsKey("transaction_ref") && !colMap.containsKey("ticket_id") && !colMap.containsKey("ref")) {
                throw new BadRequestException("CSV missing required column 'transaction_ref' or 'ticket_id'");
            }

            int refIdx = colMap.getOrDefault("transaction_ref", colMap.getOrDefault("ticket_id", colMap.get("ref")));
            int dateIdx = colMap.getOrDefault("show_date", colMap.getOrDefault("date", -1));
            int timeIdx = colMap.getOrDefault("show_time", colMap.getOrDefault("time", -1));
            int screenIdx = colMap.getOrDefault("screen_name", colMap.getOrDefault("screen", -1));
            int catIdx = colMap.getOrDefault("ticket_category", colMap.getOrDefault("category", -1));
            int qtyIdx = colMap.getOrDefault("quantity", colMap.getOrDefault("qty", -1));
            int priceIdx = colMap.getOrDefault("unit_price", colMap.getOrDefault("price", -1));
            int grossIdx = colMap.getOrDefault("gross_amount", colMap.getOrDefault("gross", -1));
            int refundIdx = colMap.getOrDefault("refund_amount", colMap.getOrDefault("refund", -1));
            int compIdx = colMap.getOrDefault("comp_tickets", colMap.getOrDefault("comp", -1));

            String line;
            while ((line = reader.readLine()) != null) {
                rowNumber++;
                if (line.trim().isEmpty()) continue;

                String[] parts = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);
                if (parts.length <= refIdx) {
                    invalidRowErrors.add("Row " + rowNumber + ": Insufficient columns");
                    continue;
                }

                String txRef = clean(parts[refIdx]);
                if (txRef.isEmpty()) {
                    invalidRowErrors.add("Row " + rowNumber + ": Empty transaction reference");
                    continue;
                }

                if (!seenRefsInFile.add(txRef)) {
                    duplicateRefs.add(txRef + " (Row " + rowNumber + ")");
                }

                LocalDate showDate = parseDate(parts, dateIdx);
                LocalTime showTime = parseTime(parts, timeIdx);
                String screenName = getVal(parts, screenIdx, "Screen 1");
                String ticketCat = getVal(parts, catIdx, "Standard");

                int qty = parseInt(parts, qtyIdx, 1);
                BigDecimal unitPrice = parseDecimal(parts, priceIdx, BigDecimal.ZERO);
                BigDecimal grossAmount = parseDecimal(parts, grossIdx, null);
                if (grossAmount == null) {
                    grossAmount = unitPrice.multiply(BigDecimal.valueOf(qty)).setScale(2, RoundingMode.HALF_UP);
                }

                BigDecimal refundAmount = parseDecimal(parts, refundIdx, BigDecimal.ZERO);
                int compTickets = parseInt(parts, compIdx, 0);

                BigDecimal netAmount = grossAmount.subtract(refundAmount).setScale(2, RoundingMode.HALF_UP);

                TicketTransaction tx = new TicketTransaction(
                        null, reconciliationId, sanitizedReportType, txRef,
                        showDate, showTime, screenName, ticketCat, qty,
                        unitPrice, grossAmount, BigDecimal.ZERO, refundAmount, netAmount,
                        compTickets, "INR"
                );

                transactions.add(tx);
                totalGross = totalGross.add(grossAmount);
                totalRefund = totalRefund.add(refundAmount);
                totalNet = totalNet.add(netAmount);
            }
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("Failed to parse CSV file: " + e.getMessage());
        }

        if (transactions.isEmpty()) {
            throw new BadRequestException("No valid transaction records found in uploaded CSV");
        }

        SourceReport report = new SourceReport(
                reconciliationId, sanitizedReportType, originalFilename, file.getSize(),
                transactions.size(), totalGross, totalRefund, totalNet, actorUsername, "PARSED"
        );
        SourceReport savedReport = sourceReportRepository.save(report);

        for (TicketTransaction tx : transactions) {
            tx.setSourceReportId(savedReport.getId());
        }
        ticketTransactionRepository.saveAll(transactions);

        auditService.recordEvent(actorUsername, actorRole, "REPORT_IMPORT", "SOURCE_REPORT", savedReport.getId(),
                String.format("Imported %s '%s' (%d records, net ₹%s)",
                        sanitizedReportType, originalFilename, transactions.size(), totalNet.toPlainString()));

        Map<String, Object> result = new HashMap<>();
        result.put("sourceReportId", savedReport.getId());
        result.put("fileName", originalFilename);
        result.put("reportType", sanitizedReportType);
        result.put("importedRecordsCount", transactions.size());
        result.put("totalGrossAmount", totalGross);
        result.put("totalRefundAmount", totalRefund);
        result.put("totalNetAmount", totalNet);
        result.put("duplicatesDetectedCount", duplicateRefs.size());
        result.put("duplicateReferences", duplicateRefs);
        result.put("invalidRowsCount", invalidRowErrors.size());
        result.put("invalidRowErrors", invalidRowErrors);
        return result;
    }

    private String clean(String val) {
        if (val == null) return "";
        return val.trim().replace("\"", "");
    }

    private String getVal(String[] parts, int idx, String def) {
        if (idx >= 0 && idx < parts.length) {
            String v = clean(parts[idx]);
            return v.isEmpty() ? def : v;
        }
        return def;
    }

    private int parseInt(String[] parts, int idx, int def) {
        if (idx >= 0 && idx < parts.length) {
            try {
                return Integer.parseInt(clean(parts[idx]));
            } catch (Exception ignored) {}
        }
        return def;
    }

    private BigDecimal parseDecimal(String[] parts, int idx, BigDecimal def) {
        if (idx >= 0 && idx < parts.length) {
            try {
                String c = clean(parts[idx]).replace("$", "").replace("₹", "").replace(",", "");
                if (!c.isEmpty()) {
                    return new BigDecimal(c).setScale(2, RoundingMode.HALF_UP);
                }
            } catch (Exception ignored) {}
        }
        return def;
    }

    private LocalDate parseDate(String[] parts, int idx) {
        if (idx >= 0 && idx < parts.length) {
            try {
                return LocalDate.parse(clean(parts[idx]), DateTimeFormatter.ISO_LOCAL_DATE);
            } catch (Exception ignored) {}
        }
        return LocalDate.now();
    }

    private LocalTime parseTime(String[] parts, int idx) {
        if (idx >= 0 && idx < parts.length) {
            try {
                return LocalTime.parse(clean(parts[idx]));
            } catch (Exception ignored) {}
        }
        return LocalTime.of(18, 0);
    }
}

package com.cineledger.service;

import com.cineledger.dto.ReconciliationCreateRequest;
import com.cineledger.dto.ReconciliationResponse;
import com.cineledger.entity.*;
import com.cineledger.exception.BadRequestException;
import com.cineledger.exception.ResourceNotFoundException;
import com.cineledger.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReconciliationService {

    private final ReconciliationRepository reconciliationRepository;
    private final FilmRepository filmRepository;
    private final CinemaRepository cinemaRepository;
    private final ContractRepository contractRepository;
    private final SourceReportRepository sourceReportRepository;
    private final TicketTransactionRepository ticketTransactionRepository;
    private final DiscrepancyRepository discrepancyRepository;
    private final SettlementRepository settlementRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public ReconciliationService(ReconciliationRepository reconciliationRepository,
                                 FilmRepository filmRepository,
                                 CinemaRepository cinemaRepository,
                                 ContractRepository contractRepository,
                                 SourceReportRepository sourceReportRepository,
                                 TicketTransactionRepository ticketTransactionRepository,
                                 DiscrepancyRepository discrepancyRepository,
                                 SettlementRepository settlementRepository,
                                 UserRepository userRepository,
                                 AuditService auditService) {
        this.reconciliationRepository = reconciliationRepository;
        this.filmRepository = filmRepository;
        this.cinemaRepository = cinemaRepository;
        this.contractRepository = contractRepository;
        this.sourceReportRepository = sourceReportRepository;
        this.ticketTransactionRepository = ticketTransactionRepository;
        this.discrepancyRepository = discrepancyRepository;
        this.settlementRepository = settlementRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    public List<ReconciliationResponse> getAllReconciliations() {
        return reconciliationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ReconciliationResponse getReconciliationById(Long id) {
        Reconciliation rec = reconciliationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reconciliation not found with id: " + id));
        return toResponse(rec);
    }

    public Reconciliation getReconciliationEntityById(Long id) {
        return reconciliationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reconciliation not found with id: " + id));
    }

    @Transactional
    public ReconciliationResponse createReconciliation(ReconciliationCreateRequest request,
                                                       String username, String role, Long userId) {
        Film film = filmRepository.findById(request.getFilmId())
                .orElseThrow(() -> new ResourceNotFoundException("Film not found with id: " + request.getFilmId()));
        Cinema cinema = cinemaRepository.findById(request.getCinemaId())
                .orElseThrow(() -> new ResourceNotFoundException("Cinema not found with id: " + request.getCinemaId()));

        if (request.getPeriodEnd().isBefore(request.getPeriodStart())) {
            throw new BadRequestException("Period end date cannot precede start date");
        }

        Long contractId = request.getContractId();
        if (contractId == null) {
            // Attempt to resolve contract automatically
            List<Contract> contracts = contractRepository.findByFilmId(film.getId());
            if (!contracts.isEmpty()) {
                contractId = contracts.get(0).getId();
            }
        }

        String reconNumber = "REC-" + LocalDate.now().getYear() + "-" + String.format("%04d", (int)(Math.random() * 9000) + 1000);

        Reconciliation rec = new Reconciliation(
                reconNumber,
                film.getId(),
                cinema.getId(),
                contractId,
                request.getPeriodStart(),
                request.getPeriodEnd(),
                "DRAFT",
                request.getNotes(),
                userId
        );

        Reconciliation saved = reconciliationRepository.save(rec);

        auditService.recordEvent(username, role, "RECONCILIATION_CREATED", "RECONCILIATION", saved.getId(),
                "Initiated reconciliation " + saved.getReconciliationNumber() + " for '" + film.getTitle() + "' at " + cinema.getName());

        return toResponse(saved);
    }

    @Transactional
    public ReconciliationResponse runReconciliation(Long reconciliationId, String username, String role) {
        Reconciliation reconciliation = reconciliationRepository.findById(reconciliationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reconciliation not found with id: " + reconciliationId));

        List<TicketTransaction> allTransactions = ticketTransactionRepository.findByReconciliationId(reconciliationId);
        if (allTransactions.isEmpty()) {
            throw new BadRequestException("No imported source records found for reconciliation " + reconciliation.getReconciliationNumber() + ". Please upload POS and Distributor CSV reports first.");
        }

        // Delete existing discrepancies for this reconciliation to ensure idempotency
        discrepancyRepository.deleteByReconciliationId(reconciliationId);

        List<TicketTransaction> posTransactions = allTransactions.stream()
                .filter(t -> "THEATRE_POS".equalsIgnoreCase(t.getSourceType()))
                .collect(Collectors.toList());

        List<TicketTransaction> distTransactions = allTransactions.stream()
                .filter(t -> !"THEATRE_POS".equalsIgnoreCase(t.getSourceType()))
                .collect(Collectors.toList());

        BigDecimal totalPos = posTransactions.stream()
                .map(TicketTransaction::getNetAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalDist = distTransactions.stream()
                .map(TicketTransaction::getNetAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalVariance = totalPos.subtract(totalDist).abs().setScale(2, RoundingMode.HALF_UP);

        Map<String, List<TicketTransaction>> posByRef = new HashMap<>();
        for (TicketTransaction t : posTransactions) {
            posByRef.computeIfAbsent(t.getTransactionRef(), k -> new ArrayList<>()).add(t);
        }

        Map<String, List<TicketTransaction>> distByRef = new HashMap<>();
        for (TicketTransaction t : distTransactions) {
            distByRef.computeIfAbsent(t.getTransactionRef(), k -> new ArrayList<>()).add(t);
        }

        List<Discrepancy> discrepancies = new ArrayList<>();
        int matchedCount = 0;
        int discSeq = 1;

        // Detect Duplicate POS IDs
        for (Map.Entry<String, List<TicketTransaction>> entry : posByRef.entrySet()) {
            if (entry.getValue().size() > 1) {
                BigDecimal sum = entry.getValue().stream().map(TicketTransaction::getNetAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
                discrepancies.add(new Discrepancy(
                        reconciliationId,
                        "DISC-" + reconciliationId + "-" + String.format("%03d", discSeq++),
                        "DUPLICATE_TRANSACTION",
                        "HIGH",
                        String.format("Duplicate transaction reference '%s' appears %d times in theatre POS records.", entry.getKey(), entry.getValue().size()),
                        entry.getKey(),
                        sum,
                        BigDecimal.ZERO,
                        sum,
                        "OPEN"
                ));
            }
        }

        // Match POS against Distributor
        for (Map.Entry<String, List<TicketTransaction>> entry : posByRef.entrySet()) {
            String ref = entry.getKey();
            TicketTransaction posTx = entry.getValue().get(0);

            if (distByRef.containsKey(ref)) {
                TicketTransaction distTx = distByRef.get(ref).get(0);
                BigDecimal diff = posTx.getNetAmount().subtract(distTx.getNetAmount()).abs().setScale(2, RoundingMode.HALF_UP);

                if (diff.compareTo(BigDecimal.ZERO) == 0) {
                    matchedCount++;
                } else {
                    String severity = diff.compareTo(new BigDecimal("100.00")) > 0 ? "HIGH" : "MEDIUM";
                    discrepancies.add(new Discrepancy(
                            reconciliationId,
                            "DISC-" + reconciliationId + "-" + String.format("%03d", discSeq++),
                            "AMOUNT_MISMATCH",
                            severity,
                            String.format("Amount mismatch for ticket ref '%s': Theatre POS net ₹%s vs Distributor statement net ₹%s (Variance: ₹%s)",
                                    ref, posTx.getNetAmount().toPlainString(), distTx.getNetAmount().toPlainString(), diff.toPlainString()),
                            ref,
                            posTx.getNetAmount(),
                            distTx.getNetAmount(),
                            diff,
                            "OPEN"
                    ));
                }

                // Refund inconsistency
                if (posTx.getRefundAmount().compareTo(BigDecimal.ZERO) > 0 &&
                    distTx.getRefundAmount().compareTo(posTx.getRefundAmount()) != 0) {
                    discrepancies.add(new Discrepancy(
                            reconciliationId,
                            "DISC-" + reconciliationId + "-" + String.format("%03d", discSeq++),
                            "REFUND_INCONSISTENCY",
                            "MEDIUM",
                            String.format("Inconsistent refund accounting for '%s': POS refund ₹%s vs Distributor refund deduction ₹%s",
                                    ref, posTx.getRefundAmount().toPlainString(), distTx.getRefundAmount().toPlainString()),
                            ref,
                            posTx.getRefundAmount(),
                            distTx.getRefundAmount(),
                            posTx.getRefundAmount().subtract(distTx.getRefundAmount()).abs(),
                            "OPEN"
                    ));
                }

                // Comp ticket variance
                if (posTx.getCompTickets() > 0 && distTx.getCompTickets() == 0) {
                    discrepancies.add(new Discrepancy(
                            reconciliationId,
                            "DISC-" + reconciliationId + "-" + String.format("%03d", discSeq++),
                            "COMP_TICKET_VARIANCE",
                            "LOW",
                            String.format("Complimentary ticket discrepancy for '%s': POS records %d complimentary admissions unacknowledged by distributor.",
                                    ref, posTx.getCompTickets()),
                            ref,
                            posTx.getGrossAmount(),
                            distTx.getGrossAmount(),
                            posTx.getGrossAmount(),
                            "OPEN"
                    ));
                }
            } else {
                // In POS, missing in distributor
                discrepancies.add(new Discrepancy(
                        reconciliationId,
                        "DISC-" + reconciliationId + "-" + String.format("%03d", discSeq++),
                        "MISSING_IN_DISTRIBUTOR",
                        "CRITICAL",
                        String.format("Ticket '%s' present in Theatre POS (net ₹%s) is missing entirely from Distributor statement.",
                                ref, posTx.getNetAmount().toPlainString()),
                        ref,
                        posTx.getNetAmount(),
                        BigDecimal.ZERO,
                        posTx.getNetAmount(),
                        "OPEN"
                ));
            }
        }

        // Check records in Distributor missing in POS
        for (Map.Entry<String, List<TicketTransaction>> entry : distByRef.entrySet()) {
            String ref = entry.getKey();
            if (!posByRef.containsKey(ref)) {
                TicketTransaction distTx = entry.getValue().get(0);
                discrepancies.add(new Discrepancy(
                        reconciliationId,
                        "DISC-" + reconciliationId + "-" + String.format("%03d", discSeq++),
                        "MISSING_IN_POS",
                        "HIGH",
                        String.format("Transaction '%s' claimed in Distributor statement (₹%s) was not found in Theatre POS ledger.",
                                ref, distTx.getNetAmount().toPlainString()),
                        ref,
                        BigDecimal.ZERO,
                        distTx.getNetAmount(),
                        distTx.getNetAmount(),
                        "OPEN"
                ));
            }
        }

        if (!discrepancies.isEmpty()) {
            discrepancyRepository.saveAll(discrepancies);
        }

        reconciliation.setTotalPosAmount(totalPos);
        reconciliation.setTotalDistributorAmount(totalDist);
        reconciliation.setTotalVariance(totalVariance);
        reconciliation.setTransactionCount(allTransactions.size());
        reconciliation.setMatchedCount(matchedCount);
        reconciliation.setDiscrepancyCount(discrepancies.size());
        reconciliation.setStatus(discrepancies.isEmpty() ? "RECONCILED" : "DISCREPANCIES_FOUND");
        reconciliation.setUpdatedAt(LocalDateTime.now());

        Reconciliation updated = reconciliationRepository.save(reconciliation);

        auditService.recordEvent(username, role, "RECONCILIATION_RUN", "RECONCILIATION", updated.getId(),
                String.format("Executed reconciliation %s: %d records matched, %d discrepancies identified (variance: ₹%s)",
                        updated.getReconciliationNumber(), matchedCount, discrepancies.size(), totalVariance.toPlainString()));

        return toResponse(updated);
    }

    public List<Discrepancy> getDiscrepancies(Long reconciliationId) {
        return discrepancyRepository.findByReconciliationId(reconciliationId);
    }

    private ReconciliationResponse toResponse(Reconciliation rec) {
        ReconciliationResponse resp = new ReconciliationResponse();
        resp.setId(rec.getId());
        resp.setReconciliationNumber(rec.getReconciliationNumber());
        resp.setFilmId(rec.getFilmId());
        resp.setCinemaId(rec.getCinemaId());
        resp.setContractId(rec.getContractId());
        resp.setPeriodStart(rec.getPeriodStart());
        resp.setPeriodEnd(rec.getPeriodEnd());
        resp.setStatus(rec.getStatus());
        resp.setTotalPosAmount(rec.getTotalPosAmount());
        resp.setTotalDistributorAmount(rec.getTotalDistributorAmount());
        resp.setTotalVariance(rec.getTotalVariance());
        resp.setTransactionCount(rec.getTransactionCount());
        resp.setMatchedCount(rec.getMatchedCount());
        resp.setDiscrepancyCount(rec.getDiscrepancyCount());
        resp.setNotes(rec.getNotes());
        resp.setRunByUserId(rec.getRunByUserId());
        resp.setCreatedAt(rec.getCreatedAt());
        resp.setUpdatedAt(rec.getUpdatedAt());

        filmRepository.findById(rec.getFilmId()).ifPresent(f -> {
            resp.setFilmTitle(f.getTitle());
            resp.setFilmPosterUrl(f.getPosterUrl());
        });

        cinemaRepository.findById(rec.getCinemaId()).ifPresent(c -> {
            resp.setCinemaName(c.getName());
            resp.setCinemaCircuit(c.getCircuitName());
            resp.setCinemaCity(c.getCity());
        });

        if (rec.getContractId() != null) {
            contractRepository.findById(rec.getContractId()).ifPresent(ctr -> {
                resp.setContractNumber(ctr.getContractNumber());
            });
        }

        if (rec.getRunByUserId() != null) {
            userRepository.findById(rec.getRunByUserId()).ifPresent(u -> {
                resp.setRunByUserName(u.getFullName());
            });
        }

        resp.setSourceReports(sourceReportRepository.findByReconciliationId(rec.getId()));
        resp.setDiscrepancies(discrepancyRepository.findByReconciliationId(rec.getId()));

        settlementRepository.findByReconciliationId(rec.getId()).ifPresent(stl -> {
            resp.setSettlementId(stl.getId());
            resp.setSettlementNumber(stl.getSettlementNumber());
        });

        return resp;
    }
}

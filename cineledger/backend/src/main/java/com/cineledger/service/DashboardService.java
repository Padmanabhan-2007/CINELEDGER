package com.cineledger.service;

import com.cineledger.dto.AuditVerifyResponse;
import com.cineledger.dto.DashboardSummaryDto;
import com.cineledger.entity.Dispute;
import com.cineledger.entity.Settlement;
import com.cineledger.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {

    private final ReconciliationRepository reconciliationRepository;
    private final DiscrepancyRepository discrepancyRepository;
    private final SettlementRepository settlementRepository;
    private final DisputeRepository disputeRepository;
    private final FilmService filmService;
    private final ReconciliationService reconciliationService;
    private final SettlementService settlementService;
    private final DisputeService disputeService;
    private final AuditService auditService;

    public DashboardService(ReconciliationRepository reconciliationRepository,
                            DiscrepancyRepository discrepancyRepository,
                            SettlementRepository settlementRepository,
                            DisputeRepository disputeRepository,
                            FilmService filmService,
                            ReconciliationService reconciliationService,
                            SettlementService settlementService,
                            DisputeService disputeService,
                            AuditService auditService) {
        this.reconciliationRepository = reconciliationRepository;
        this.discrepancyRepository = discrepancyRepository;
        this.settlementRepository = settlementRepository;
        this.disputeRepository = disputeRepository;
        this.filmService = filmService;
        this.reconciliationService = reconciliationService;
        this.settlementService = settlementService;
        this.disputeService = disputeService;
        this.auditService = auditService;
    }

    public DashboardSummaryDto getDashboardSummary() {
        DashboardSummaryDto dto = new DashboardSummaryDto();

        dto.setTotalReconciliations(reconciliationRepository.count());
        dto.setReconciledCount(reconciliationRepository.findByStatus("RECONCILED").size());
        dto.setOpenDiscrepanciesCount(discrepancyRepository.countByStatus("OPEN") + discrepancyRepository.countByStatus("UNDER_REVIEW"));
        dto.setPendingSettlementsCount(settlementRepository.countByStatus("PENDING_APPROVAL"));

        BigDecimal totalSettled = settlementRepository.findAll().stream()
                .map(Settlement::getFinalPayableAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotalSettlementAmount(totalSettled);

        BigDecimal totalDisputed = disputeRepository.findAll().stream()
                .filter(d -> "OPEN".equals(d.getStatus()) || "IN_REVIEW".equals(d.getStatus()))
                .map(Dispute::getDisputedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotalDisputedAmount(totalDisputed);

        AuditVerifyResponse auditCheck = auditService.verifyAuditChain();
        dto.setChainIntegrityStatus(auditCheck.isValid() ? "SECURE" : "COMPROMISED");
        dto.setAuditChainLength(auditCheck.getTotalEvents());

        dto.setRecentFilms(filmService.getAllFilms(null).stream().limit(6).toList());
        dto.setRecentReconciliations(reconciliationService.getAllReconciliations().stream().limit(5).toList());
        dto.setPendingSettlements(settlementService.getAllSettlements().stream()
                .filter(s -> "PENDING_APPROVAL".equals(s.getStatus())).limit(5).toList());
        dto.setActiveDisputes(disputeService.getAllDisputes("OPEN").stream().limit(5).toList());
        dto.setRecentAuditEvents(auditService.getRecentEvents().stream().limit(8).toList());

        return dto;
    }
}

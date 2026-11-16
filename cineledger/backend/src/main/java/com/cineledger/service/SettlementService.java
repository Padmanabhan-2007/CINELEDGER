package com.cineledger.service;

import com.cineledger.dto.SettlementCalculationResponse;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SettlementService {

    private final SettlementRepository settlementRepository;
    private final SettlementLineItemRepository lineItemRepository;
    private final ReconciliationRepository reconciliationRepository;
    private final ContractRepository contractRepository;
    private final ContractVersionRepository contractVersionRepository;
    private final FilmRepository filmRepository;
    private final CinemaRepository cinemaRepository;
    private final OrganizationRepository organizationRepository;
    private final AuditService auditService;

    public SettlementService(SettlementRepository settlementRepository,
                             SettlementLineItemRepository lineItemRepository,
                             ReconciliationRepository reconciliationRepository,
                             ContractRepository contractRepository,
                             ContractVersionRepository contractVersionRepository,
                             FilmRepository filmRepository,
                             CinemaRepository cinemaRepository,
                             OrganizationRepository organizationRepository,
                             AuditService auditService) {
        this.settlementRepository = settlementRepository;
        this.lineItemRepository = lineItemRepository;
        this.reconciliationRepository = reconciliationRepository;
        this.contractRepository = contractRepository;
        this.contractVersionRepository = contractVersionRepository;
        this.filmRepository = filmRepository;
        this.cinemaRepository = cinemaRepository;
        this.organizationRepository = organizationRepository;
        this.auditService = auditService;
    }

    public List<SettlementCalculationResponse> getAllSettlements() {
        return settlementRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    public SettlementCalculationResponse getSettlementById(Long id) {
        Settlement s = settlementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Settlement not found with id: " + id));
        return toResponse(s);
    }

    public Optional<SettlementCalculationResponse> getSettlementByReconciliationId(Long reconciliationId) {
        return settlementRepository.findByReconciliationId(reconciliationId).map(this::toResponse);
    }

    @Transactional
    public SettlementCalculationResponse calculateSettlement(Long reconciliationId, Long contractId,
                                                             String username, String role) {
        Reconciliation rec = reconciliationRepository.findById(reconciliationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reconciliation not found with id: " + reconciliationId));

        final Long finalContractId;
        if (contractId != null) {
            finalContractId = contractId;
        } else if (rec.getContractId() != null) {
            finalContractId = rec.getContractId();
        } else {
            List<Contract> contracts = contractRepository.findByFilmId(rec.getFilmId());
            if (contracts.isEmpty()) {
                throw new BadRequestException("No contract found for film ID " + rec.getFilmId() + ". Please execute a theatrical exhibition contract before calculating settlement.");
            }
            finalContractId = contracts.get(0).getId();
        }

        Contract contract = contractRepository.findById(finalContractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with id: " + finalContractId));

        LocalDate periodStart = rec.getPeriodStart();
        ContractVersion version = contractVersionRepository.findEffectiveVersion(contract.getId(), periodStart)
                .orElseGet(() -> {
                    List<ContractVersion> list = contractVersionRepository.findByContractIdOrderByVersionNumberDesc(contract.getId());
                    if (list.isEmpty()) {
                        throw new BadRequestException("Contract " + contract.getContractNumber() + " has no configured terms versions.");
                    }
                    return list.get(0);
                });

        // Use POS gross revenue as base
        BigDecimal grossRevenue = rec.getTotalPosAmount() != null && rec.getTotalPosAmount().compareTo(BigDecimal.ZERO) > 0
                ? rec.getTotalPosAmount()
                : (rec.getTotalDistributorAmount() != null ? rec.getTotalDistributorAmount() : BigDecimal.ZERO);

        if (grossRevenue.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Gross box office revenue is zero. Reconcile transaction reports before settlement calculation.");
        }

        // 1. Tax deduction (GST)
        BigDecimal taxRate = version.getTaxRatePercentage() != null ? version.getTaxRatePercentage() : BigDecimal.ZERO;
        BigDecimal taxDeduction = grossRevenue.multiply(taxRate)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        // 2. Convenience fee deduction
        BigDecimal convRate = version.getConvenienceFeeDeductionPct() != null ? version.getConvenienceFeeDeductionPct() : BigDecimal.ZERO;
        BigDecimal convDeduction = grossRevenue.multiply(convRate)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        // 3. VPF deduction
        BigDecimal vpfDeduction = version.getVirtualPrintFeePerShow() != null ? version.getVirtualPrintFeePerShow() : BigDecimal.ZERO;

        BigDecimal totalAllowableDeductions = taxDeduction.add(convDeduction).add(vpfDeduction).setScale(2, RoundingMode.HALF_UP);

        // 4. Net Settlement Basis
        BigDecimal netSettlementBasis;
        if ("NET_BOX_OFFICE".equalsIgnoreCase(contract.getSettlementBasis())) {
            netSettlementBasis = grossRevenue.subtract(totalAllowableDeductions).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
        } else {
            netSettlementBasis = grossRevenue; // Gross Box Office basis
        }

        // 5. Distributor and Exhibitor Shares
        BigDecimal distSharePct = version.getDistributorSharePercentage();
        if (distSharePct == null || distSharePct.compareTo(BigDecimal.ZERO) < 0 || distSharePct.compareTo(new BigDecimal("100.00")) > 0) {
            throw new BadRequestException("Invalid distributor share percentage in contract version: " + distSharePct);
        }

        BigDecimal distributorAmount = netSettlementBasis.multiply(distSharePct)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        BigDecimal exhibitorAmount = netSettlementBasis.subtract(distributorAmount).setScale(2, RoundingMode.HALF_UP);

        // Save or update Settlement
        Settlement settlement = settlementRepository.findByReconciliationId(reconciliationId)
                .orElse(new Settlement());

        if (settlement.getId() != null && "APPROVED".equalsIgnoreCase(settlement.getStatus())) {
            throw new BadRequestException("Settlement " + settlement.getSettlementNumber() + " is already approved and finalized. Modifications are restricted.");
        }

        if (settlement.getSettlementNumber() == null) {
            settlement.setSettlementNumber("STL-" + LocalDate.now().getYear() + "-" + String.format("%04d", (int)(Math.random() * 9000) + 1000));
        }

        settlement.setReconciliationId(reconciliationId);
        settlement.setContractId(contract.getId());
        settlement.setContractVersionId(version.getId());
        settlement.setReportingPeriodStart(rec.getPeriodStart());
        settlement.setReportingPeriodEnd(rec.getPeriodEnd());
        settlement.setGrossBoxOffice(grossRevenue);
        settlement.setAllowableDeductions(totalAllowableDeductions);
        settlement.setNetSettlementBasis(netSettlementBasis);
        settlement.setDistributorSharePct(distSharePct);
        settlement.setDistributorSettlementAmount(distributorAmount);
        settlement.setExhibitorSettlementAmount(exhibitorAmount);
        settlement.setAdjustmentAmount(BigDecimal.ZERO);
        settlement.setFinalPayableAmount(distributorAmount);
        settlement.setPayableTo("DISTRIBUTOR");
        settlement.setStatus("PENDING_APPROVAL");

        Settlement savedSettlement = settlementRepository.save(settlement);

        // Generate Line Items
        if (savedSettlement.getId() != null) {
            lineItemRepository.deleteBySettlementId(savedSettlement.getId());
        }

        List<SettlementLineItem> items = new ArrayList<>();
        int order = 1;

        items.add(new SettlementLineItem(savedSettlement.getId(), order++, "GROSS_REVENUE",
                "Gross Box Office Collections (Reported POS)", grossRevenue, BigDecimal.ONE, grossRevenue));

        if (taxDeduction.compareTo(BigDecimal.ZERO) > 0) {
            items.add(new SettlementLineItem(savedSettlement.getId(), order++, "TAX_DEDUCTION",
                    String.format("Goods & Services Tax (GST @ %s%%)", taxRate.toPlainString()),
                    grossRevenue, taxRate, taxDeduction.negate()));
        }

        if (convDeduction.compareTo(BigDecimal.ZERO) > 0) {
            items.add(new SettlementLineItem(savedSettlement.getId(), order++, "CONVENIENCE_ADJUSTMENT",
                    String.format("Online Convenience & Gateway Fee deduction (@ %s%%)", convRate.toPlainString()),
                    grossRevenue, convRate, convDeduction.negate()));
        }

        if (vpfDeduction.compareTo(BigDecimal.ZERO) > 0) {
            items.add(new SettlementLineItem(savedSettlement.getId(), order++, "VPF_DEDUCTION",
                    "Virtual Print Fee (VPF) Standard Exhibition Adjustment",
                    vpfDeduction, BigDecimal.ONE, vpfDeduction.negate()));
        }

        items.add(new SettlementLineItem(savedSettlement.getId(), order++, "NET_SETTLEMENT_BASIS",
                "Net Distributable Settlement Pool (" + contract.getSettlementBasis() + ")",
                netSettlementBasis, BigDecimal.ONE, netSettlementBasis));

        items.add(new SettlementLineItem(savedSettlement.getId(), order++, "DISTRIBUTOR_SHARE",
                String.format("Distributor Revenue Share Entitlement (%s%%)", distSharePct.toPlainString()),
                netSettlementBasis, distSharePct, distributorAmount));

        items.add(new SettlementLineItem(savedSettlement.getId(), order++, "EXHIBITOR_SHARE",
                String.format("Exhibitor Theatre Retention (%s%%)", version.getExhibitorSharePercentage().toPlainString()),
                netSettlementBasis, version.getExhibitorSharePercentage(), exhibitorAmount));

        lineItemRepository.saveAll(items);

        // Update reconciliation contract linkage if missing
        if (rec.getContractId() == null) {
            rec.setContractId(contract.getId());
            reconciliationRepository.save(rec);
        }

        auditService.recordEvent(username, role, "SETTLEMENT_CALCULATED", "SETTLEMENT", savedSettlement.getId(),
                String.format("Calculated settlement %s: Gross ₹%s -> Net Basis ₹%s -> Distributor Payable ₹%s (%s%% share)",
                        savedSettlement.getSettlementNumber(), grossRevenue.toPlainString(),
                        netSettlementBasis.toPlainString(), distributorAmount.toPlainString(), distSharePct.toPlainString()));

        return toResponse(savedSettlement);
    }

    @Transactional
    public SettlementCalculationResponse approveSettlement(Long settlementId, String paymentRef,
                                                           String username, String role) {
        Settlement s = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new ResourceNotFoundException("Settlement not found with id: " + settlementId));

        if ("APPROVED".equalsIgnoreCase(s.getStatus())) {
            throw new BadRequestException("Settlement " + s.getSettlementNumber() + " is already approved");
        }

        s.setStatus("APPROVED");
        s.setApprovedBy(username != null ? username : "analyst@cineledger.io");
        s.setApprovedAt(LocalDateTime.now());
        s.setPaymentReference(paymentRef != null ? paymentRef.trim() : "TXN-REF-" + System.currentTimeMillis());

        Settlement saved = settlementRepository.save(s);

        // Update parent reconciliation status
        reconciliationRepository.findById(s.getReconciliationId()).ifPresent(rec -> {
            rec.setStatus("SETTLED");
            reconciliationRepository.save(rec);
        });

        auditService.recordEvent(username, role, "SETTLEMENT_APPROVED", "SETTLEMENT", saved.getId(),
                String.format("Approved settlement %s for payment of ₹%s (Ref: %s)",
                        saved.getSettlementNumber(), saved.getFinalPayableAmount().toPlainString(), saved.getPaymentReference()));

        return toResponse(saved);
    }

    private SettlementCalculationResponse toResponse(Settlement s) {
        SettlementCalculationResponse resp = new SettlementCalculationResponse();
        resp.setId(s.getId());
        resp.setSettlementNumber(s.getSettlementNumber());
        resp.setReconciliationId(s.getReconciliationId());
        resp.setContractId(s.getContractId());
        resp.setContractVersionId(s.getContractVersionId());
        resp.setReportingPeriodStart(s.getReportingPeriodStart());
        resp.setReportingPeriodEnd(s.getReportingPeriodEnd());
        resp.setGrossBoxOffice(s.getGrossBoxOffice());
        resp.setAllowableDeductions(s.getAllowableDeductions());
        resp.setNetSettlementBasis(s.getNetSettlementBasis());
        resp.setDistributorSharePct(s.getDistributorSharePct());
        resp.setDistributorSettlementAmount(s.getDistributorSettlementAmount());
        resp.setExhibitorSettlementAmount(s.getExhibitorSettlementAmount());
        resp.setAdjustmentAmount(s.getAdjustmentAmount());
        resp.setFinalPayableAmount(s.getFinalPayableAmount());
        resp.setPayableTo(s.getPayableTo());
        resp.setStatus(s.getStatus());
        resp.setApprovedBy(s.getApprovedBy());
        resp.setApprovedAt(s.getApprovedAt());
        resp.setPaymentReference(s.getPaymentReference());

        reconciliationRepository.findById(s.getReconciliationId()).ifPresent(rec -> {
            resp.setReconciliationNumber(rec.getReconciliationNumber());
            filmRepository.findById(rec.getFilmId()).ifPresent(f -> {
                resp.setFilmTitle(f.getTitle());
                resp.setFilmPosterUrl(f.getPosterUrl());
            });
            cinemaRepository.findById(rec.getCinemaId()).ifPresent(c -> {
                resp.setCinemaName(c.getName());
                resp.setCircuitName(c.getCircuitName());
            });
        });

        contractRepository.findById(s.getContractId()).ifPresent(c -> {
            resp.setContractNumber(c.getContractNumber());
            organizationRepository.findById(c.getDistributorId()).ifPresent(d -> resp.setDistributorName(d.getName()));
            organizationRepository.findById(c.getExhibitorId()).ifPresent(e -> resp.setExhibitorName(e.getName()));
        });

        contractVersionRepository.findById(s.getContractVersionId()).ifPresent(cv -> {
            resp.setContractVersionNumber(cv.getVersionNumber());
        });

        List<SettlementLineItem> items = lineItemRepository.findBySettlementIdOrderByItemOrderAsc(s.getId());
        resp.setLineItems(items);

        // Build human readable calculation explanation
        resp.setCalculationExplanation(String.format(
                "Gross Box Office ₹%s less Allowable Deductions ₹%s = Net Settlement Basis ₹%s. Distributor Entitlement (%s%%) = ₹%s payable to Distributor.",
                s.getGrossBoxOffice().toPlainString(),
                s.getAllowableDeductions().toPlainString(),
                s.getNetSettlementBasis().toPlainString(),
                s.getDistributorSharePct().toPlainString(),
                s.getDistributorSettlementAmount().toPlainString()
        ));

        return resp;
    }
}

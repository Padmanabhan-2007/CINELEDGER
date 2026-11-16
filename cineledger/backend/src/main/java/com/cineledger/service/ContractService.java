package com.cineledger.service;

import com.cineledger.dto.ContractDto;
import com.cineledger.entity.*;
import com.cineledger.exception.ConflictException;
import com.cineledger.exception.ResourceNotFoundException;
import com.cineledger.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ContractService {

    private final ContractRepository contractRepository;
    private final ContractVersionRepository contractVersionRepository;
    private final FilmRepository filmRepository;
    private final OrganizationRepository organizationRepository;
    private final AuditService auditService;

    public ContractService(ContractRepository contractRepository,
                           ContractVersionRepository contractVersionRepository,
                           FilmRepository filmRepository,
                           OrganizationRepository organizationRepository,
                           AuditService auditService) {
        this.contractRepository = contractRepository;
        this.contractVersionRepository = contractVersionRepository;
        this.filmRepository = filmRepository;
        this.organizationRepository = organizationRepository;
        this.auditService = auditService;
    }

    public List<ContractDto> getAllContracts() {
        return contractRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public ContractDto getContractById(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with id: " + id));
        return toDto(contract);
    }

    public Contract getContractEntityById(Long id) {
        return contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with id: " + id));
    }

    public ContractVersion getEffectiveVersion(Long contractId, LocalDate date) {
        LocalDate effectiveDate = (date != null) ? date : LocalDate.now();
        return contractVersionRepository.findEffectiveVersion(contractId, effectiveDate)
                .orElseGet(() -> {
                    List<ContractVersion> versions = contractVersionRepository.findByContractIdOrderByVersionNumberDesc(contractId);
                    if (!versions.isEmpty()) {
                        return versions.get(0);
                    }
                    throw new ResourceNotFoundException("No effective contract version found for contract ID: " + contractId + " on date: " + effectiveDate);
                });
    }

    @Transactional
    public ContractDto createContract(ContractDto dto, String username, String role) {
        if (contractRepository.findByContractNumber(dto.getContractNumber()).isPresent()) {
            throw new ConflictException("Contract with number '" + dto.getContractNumber() + "' already exists");
        }

        Contract contract = new Contract(
                dto.getContractNumber().trim(),
                dto.getTitle().trim(),
                dto.getFilmId(),
                dto.getDistributorId(),
                dto.getExhibitorId(),
                dto.getSettlementBasis() != null ? dto.getSettlementBasis() : "GROSS_BOX_OFFICE",
                dto.getStatus() != null ? dto.getStatus() : "ACTIVE"
        );

        Contract saved = contractRepository.save(contract);

        // Create version 1 terms
        ContractVersion version = new ContractVersion(
                saved.getId(),
                1,
                dto.getEffectiveFrom() != null ? dto.getEffectiveFrom() : LocalDate.now().minusDays(30),
                dto.getEffectiveTo(),
                dto.getDistributorSharePercentage() != null ? dto.getDistributorSharePercentage() : new BigDecimal("50.00"),
                dto.getExhibitorSharePercentage() != null ? dto.getExhibitorSharePercentage() : new BigDecimal("50.00"),
                dto.getConvenienceFeeDeductionPct() != null ? dto.getConvenienceFeeDeductionPct() : new BigDecimal("2.50"),
                dto.getVirtualPrintFeePerShow() != null ? dto.getVirtualPrintFeePerShow() : new BigDecimal("500.00"),
                dto.getTaxRatePercentage() != null ? dto.getTaxRatePercentage() : new BigDecimal("18.00"),
                dto.getTermsSummary() != null ? dto.getTermsSummary() : "Standard theatrical exhibition agreement with 50/50 revenue share and standard deductions.",
                true
        );
        contractVersionRepository.save(version);

        auditService.recordEvent(username, role, "CONTRACT_CREATED", "CONTRACT", saved.getId(),
                "Executed contract '" + saved.getContractNumber() + "' for film ID " + saved.getFilmId());

        return toDto(saved);
    }

    private ContractDto toDto(Contract contract) {
        ContractDto dto = new ContractDto();
        dto.setId(contract.getId());
        dto.setContractNumber(contract.getContractNumber());
        dto.setTitle(contract.getTitle());
        dto.setFilmId(contract.getFilmId());
        dto.setDistributorId(contract.getDistributorId());
        dto.setExhibitorId(contract.getExhibitorId());
        dto.setSettlementBasis(contract.getSettlementBasis());
        dto.setStatus(contract.getStatus());

        filmRepository.findById(contract.getFilmId()).ifPresent(f -> dto.setFilmTitle(f.getTitle()));
        organizationRepository.findById(contract.getDistributorId()).ifPresent(o -> dto.setDistributorName(o.getName()));
        organizationRepository.findById(contract.getExhibitorId()).ifPresent(o -> dto.setExhibitorName(o.getName()));

        List<ContractVersion> versions = contractVersionRepository.findByContractIdOrderByVersionNumberDesc(contract.getId());
        if (!versions.isEmpty()) {
            ContractVersion v = versions.get(0);
            dto.setActiveVersionNumber(v.getVersionNumber());
            dto.setEffectiveFrom(v.getEffectiveFrom());
            dto.setEffectiveTo(v.getEffectiveTo());
            dto.setDistributorSharePercentage(v.getDistributorSharePercentage());
            dto.setExhibitorSharePercentage(v.getExhibitorSharePercentage());
            dto.setConvenienceFeeDeductionPct(v.getConvenienceFeeDeductionPct());
            dto.setVirtualPrintFeePerShow(v.getVirtualPrintFeePerShow());
            dto.setTaxRatePercentage(v.getTaxRatePercentage());
            dto.setTermsSummary(v.getTermsSummary());
        }

        return dto;
    }
}

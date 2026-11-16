package com.cineledger.service;

import com.cineledger.dto.DisputeCorrectionRequest;
import com.cineledger.dto.DisputeCreateRequest;
import com.cineledger.dto.DisputeResponse;
import com.cineledger.entity.*;
import com.cineledger.exception.BadRequestException;
import com.cineledger.exception.ResourceNotFoundException;
import com.cineledger.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final DisputeCommentRepository commentRepository;
    private final EvidenceAttachmentRepository evidenceRepository;
    private final DiscrepancyRepository discrepancyRepository;
    private final ReconciliationRepository reconciliationRepository;
    private final FilmRepository filmRepository;
    private final CinemaRepository cinemaRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public DisputeService(DisputeRepository disputeRepository,
                          DisputeCommentRepository commentRepository,
                          EvidenceAttachmentRepository evidenceRepository,
                          DiscrepancyRepository discrepancyRepository,
                          ReconciliationRepository reconciliationRepository,
                          FilmRepository filmRepository,
                          CinemaRepository cinemaRepository,
                          UserRepository userRepository,
                          AuditService auditService) {
        this.disputeRepository = disputeRepository;
        this.commentRepository = commentRepository;
        this.evidenceRepository = evidenceRepository;
        this.discrepancyRepository = discrepancyRepository;
        this.reconciliationRepository = reconciliationRepository;
        this.filmRepository = filmRepository;
        this.cinemaRepository = cinemaRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    public List<DisputeResponse> getAllDisputes(String status) {
        List<Dispute> list;
        if (status != null && !status.isBlank()) {
            list = disputeRepository.findByStatus(status.trim().toUpperCase());
        } else {
            list = disputeRepository.findAllByOrderByCreatedAtDesc();
        }
        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public DisputeResponse getDisputeById(Long id) {
        Dispute dispute = disputeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found with id: " + id));
        return toResponse(dispute);
    }

    @Transactional
    public DisputeResponse createDispute(DisputeCreateRequest request, String username, String role, Long userId) {
        reconciliationRepository.findById(request.getReconciliationId())
                .orElseThrow(() -> new ResourceNotFoundException("Reconciliation not found with id: " + request.getReconciliationId()));

        if (request.getDiscrepancyId() != null) {
            Discrepancy disc = discrepancyRepository.findById(request.getDiscrepancyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Discrepancy not found with id: " + request.getDiscrepancyId()));
            disc.setStatus("UNDER_REVIEW");
            discrepancyRepository.save(disc);
        }

        String disputeNumber = "DSP-" + LocalDate.now().getYear() + "-" + String.format("%04d", (int)(Math.random() * 9000) + 1000);

        Dispute dispute = new Dispute();
        dispute.setDisputeNumber(disputeNumber);
        dispute.setDiscrepancyId(request.getDiscrepancyId());
        dispute.setReconciliationId(request.getReconciliationId());
        dispute.setTitle(request.getTitle().trim());
        dispute.setReason(request.getReason().trim());
        dispute.setDisputedAmount(request.getDisputedAmount());
        dispute.setProposedCorrection(request.getProposedCorrection());
        dispute.setStatus("OPEN");
        dispute.setOpenedByUserId(userId);
        dispute.setCreatedAt(LocalDateTime.now());
        dispute.setUpdatedAt(LocalDateTime.now());

        Dispute saved = disputeRepository.save(dispute);

        // Add initial system comment
        commentRepository.save(new DisputeComment(
                saved.getId(),
                userId,
                username != null ? username : "System",
                role != null ? role : "ANALYST",
                "Dispute opened for review. Reason: " + request.getReason()
        ));

        auditService.recordEvent(username, role, "DISPUTE_OPENED", "DISPUTE", saved.getId(),
                "Opened dispute " + saved.getDisputeNumber() + " with disputed amount ₹" + saved.getDisputedAmount().toPlainString());

        return toResponse(saved);
    }

    @Transactional
    public DisputeResponse addComment(Long disputeId, String commentText, Long authorId, String authorName, String authorRole) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found with id: " + disputeId));

        if (commentText == null || commentText.trim().isEmpty()) {
            throw new BadRequestException("Comment text cannot be empty");
        }

        DisputeComment comment = new DisputeComment(disputeId, authorId,
                authorName != null ? authorName : "System",
                authorRole != null ? authorRole : "USER",
                commentText.trim());
        commentRepository.save(comment);

        if ("OPEN".equals(dispute.getStatus())) {
            dispute.setStatus("IN_REVIEW");
            dispute.setUpdatedAt(LocalDateTime.now());
            disputeRepository.save(dispute);
        }

        auditService.recordEvent(authorName, authorRole, "DISPUTE_COMMENT_ADDED", "DISPUTE", disputeId,
                "Added comment to dispute " + dispute.getDisputeNumber());

        return toResponse(dispute);
    }

    @Transactional
    public DisputeResponse attachEvidence(Long disputeId, String fileName, Long fileSize, String fileType,
                                          String fileUrl, String description, String username, String role) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found with id: " + disputeId));

        EvidenceAttachment attachment = new EvidenceAttachment(
                disputeId,
                fileName != null ? fileName : "evidence_document.pdf",
                fileSize != null ? fileSize : 1024L,
                fileType != null ? fileType : "PDF",
                fileUrl != null ? fileUrl : "/attachments/" + fileName,
                description,
                username
        );
        evidenceRepository.save(attachment);

        auditService.recordEvent(username, role, "EVIDENCE_ATTACHED", "DISPUTE", disputeId,
                "Attached evidence '" + attachment.getFileName() + "' to dispute " + dispute.getDisputeNumber());

        return toResponse(dispute);
    }

    @Transactional
    public DisputeResponse resolveOrReject(Long disputeId, DisputeCorrectionRequest request, String username, String role) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found with id: " + disputeId));

        if ("RESOLVED".equals(dispute.getStatus()) || "REJECTED".equals(dispute.getStatus())) {
            throw new BadRequestException("Dispute " + dispute.getDisputeNumber() + " is already finalized (" + dispute.getStatus() + ")");
        }

        String decision = request.getDecision() != null ? request.getDecision().trim().toUpperCase() : "RESOLVED";
        if (!"RESOLVED".equals(decision) && !"REJECTED".equals(decision)) {
            throw new BadRequestException("Decision must be either 'RESOLVED' or 'REJECTED'");
        }

        dispute.setStatus(decision);
        if (request.getProposedCorrection() != null) {
            dispute.setProposedCorrection(request.getProposedCorrection());
        }
        dispute.setResolutionSummary(request.getResolutionSummary());
        dispute.setUpdatedAt(LocalDateTime.now());

        Dispute saved = disputeRepository.save(dispute);

        // Update discrepancy if present
        if (dispute.getDiscrepancyId() != null) {
            discrepancyRepository.findById(dispute.getDiscrepancyId()).ifPresent(disc -> {
                disc.setStatus(decision);
                disc.setResolutionNotes(request.getResolutionSummary());
                disc.setResolvedAt(LocalDateTime.now());
                disc.setResolvedBy(username);
                discrepancyRepository.save(disc);
            });
        }

        // Add closing comment
        commentRepository.save(new DisputeComment(
                disputeId, null, username != null ? username : "Arbitrator", role != null ? role : "ADMIN",
                "Dispute decision recorded: " + decision + ". Notes: " + request.getResolutionSummary()
        ));

        auditService.recordEvent(username, role, "DISPUTE_" + decision, "DISPUTE", saved.getId(),
                "Dispute " + saved.getDisputeNumber() + " was " + decision + ". Summary: " + request.getResolutionSummary());

        return toResponse(saved);
    }

    private DisputeResponse toResponse(Dispute d) {
        DisputeResponse resp = new DisputeResponse();
        resp.setId(d.getId());
        resp.setDisputeNumber(d.getDisputeNumber());
        resp.setDiscrepancyId(d.getDiscrepancyId());
        resp.setReconciliationId(d.getReconciliationId());
        resp.setTitle(d.getTitle());
        resp.setReason(d.getReason());
        resp.setDisputedAmount(d.getDisputedAmount());
        resp.setProposedCorrection(d.getProposedCorrection());
        resp.setStatus(d.getStatus());
        resp.setOpenedByUserId(d.getOpenedByUserId());
        resp.setResolutionSummary(d.getResolutionSummary());
        resp.setCreatedAt(d.getCreatedAt());
        resp.setUpdatedAt(d.getUpdatedAt());

        if (d.getDiscrepancyId() != null) {
            discrepancyRepository.findById(d.getDiscrepancyId()).ifPresent(disc -> {
                resp.setDiscrepancyCode(disc.getDiscrepancyCode());
                resp.setDiscrepancyType(disc.getDiscrepancyType());
            });
        }

        reconciliationRepository.findById(d.getReconciliationId()).ifPresent(rec -> {
            resp.setReconciliationNumber(rec.getReconciliationNumber());
            filmRepository.findById(rec.getFilmId()).ifPresent(f -> {
                resp.setFilmTitle(f.getTitle());
                resp.setFilmPosterUrl(f.getPosterUrl());
            });
            cinemaRepository.findById(rec.getCinemaId()).ifPresent(c -> {
                resp.setCinemaName(c.getName());
            });
        });

        if (d.getOpenedByUserId() != null) {
            userRepository.findById(d.getOpenedByUserId()).ifPresent(u -> resp.setOpenedByName(u.getFullName()));
        }

        resp.setComments(commentRepository.findByDisputeIdOrderByCreatedAtAsc(d.getId()));
        resp.setEvidence(evidenceRepository.findByDisputeIdOrderByUploadedAtAsc(d.getId()));

        return resp;
    }
}

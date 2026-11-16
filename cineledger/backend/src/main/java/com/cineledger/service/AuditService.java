package com.cineledger.service;

import com.cineledger.dto.AuditVerifyResponse;
import com.cineledger.entity.AuditEvent;
import com.cineledger.repository.AuditEventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AuditService {

    public static final String GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

    private final AuditEventRepository auditEventRepository;

    public AuditService(AuditEventRepository auditEventRepository) {
        this.auditEventRepository = auditEventRepository;
    }

    @Transactional
    public synchronized AuditEvent recordEvent(String actorUsername, String actorRole, String eventType,
                                              String entityType, Long entityId, String description) {
        Optional<AuditEvent> lastEventOpt = auditEventRepository.findTopByOrderBySequenceNumberDesc();

        long sequenceNumber = lastEventOpt.map(e -> e.getSequenceNumber() + 1).orElse(1L);
        String previousHash = lastEventOpt.map(AuditEvent::getCurrentHash).orElse(GENESIS_HASH);
        LocalDateTime timestamp = LocalDateTime.now();

        String actor = (actorUsername != null && !actorUsername.isBlank()) ? actorUsername : "system";
        String role = (actorRole != null && !actorRole.isBlank()) ? actorRole : "SYSTEM";
        String desc = description != null ? description.trim() : "";

        String canonicalPayload = String.format("%d|%s|%s|%s|%s|%s|%d|%s",
                sequenceNumber, timestamp, actor, role, eventType, entityType, entityId != null ? entityId : 0L, desc);

        String currentHash = calculateSha256(previousHash + "|" + canonicalPayload);

        AuditEvent event = new AuditEvent(sequenceNumber, timestamp, actor, role, eventType,
                entityType, entityId, desc, canonicalPayload, previousHash, currentHash);

        return auditEventRepository.save(event);
    }

    @Transactional(readOnly = true)
    public AuditVerifyResponse verifyAuditChain() {
        List<AuditEvent> events = auditEventRepository.findAllByOrderBySequenceNumberAsc();

        if (events.isEmpty()) {
            return new AuditVerifyResponse(true, 0, null, null, "Audit trail is empty. Genesis state intact.");
        }

        String expectedPrevHash = GENESIS_HASH;
        long expectedSequence = 1L;

        for (AuditEvent event : events) {
            // Check sequence continuity
            if (event.getSequenceNumber() != expectedSequence) {
                return new AuditVerifyResponse(false, events.size(), event.getId(), event.getSequenceNumber(),
                        String.format("Sequence discontinuity detected at ID %d: expected sequence %d, found %d",
                                event.getId(), expectedSequence, event.getSequenceNumber()));
            }

            // Check previous hash linkage
            if (!event.getPreviousHash().equals(expectedPrevHash)) {
                return new AuditVerifyResponse(false, events.size(), event.getId(), event.getSequenceNumber(),
                        String.format("Hash chain linkage mismatch at ID %d (Sequence %d): expected prevHash '%s', found '%s'",
                                event.getId(), event.getSequenceNumber(), expectedPrevHash, event.getPreviousHash()));
            }

            // Recalculate hash of current block
            String recalculatedHash = calculateSha256(expectedPrevHash + "|" + event.getCanonicalPayload());
            if (!event.getCurrentHash().equalsIgnoreCase(recalculatedHash)) {
                return new AuditVerifyResponse(false, events.size(), event.getId(), event.getSequenceNumber(),
                        String.format("Cryptographic signature failure at ID %d (Sequence %d): payload or hash has been altered!",
                                event.getId(), event.getSequenceNumber()));
            }

            expectedPrevHash = event.getCurrentHash();
            expectedSequence++;
        }

        return new AuditVerifyResponse(true, events.size(), null, null,
                String.format("Cryptographic SHA-256 chain verified intact across %d audit events. Zero tampering detected.", events.size()));
    }

    public List<AuditEvent> getRecentEvents() {
        return auditEventRepository.findTop50ByOrderBySequenceNumberDesc();
    }

    public List<AuditEvent> getAllEvents() {
        return auditEventRepository.findAllByOrderBySequenceNumberDesc();
    }

    @Transactional
    public AuditEvent tamperEventForTesting(Long eventId, String corruptedDescription) {
        AuditEvent event = auditEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));
        // Deliberately tamper with description without updating hash or payload to simulate illicit mutation
        event.setDescription(corruptedDescription != null ? corruptedDescription : "TAMPERED_UNAUTHORIZED_MUTATION");
        event.setCanonicalPayload(event.getCanonicalPayload() + "_MUTATED");
        return auditEventRepository.save(event);
    }

    @Transactional
    public void restoreChain() {
        List<AuditEvent> events = auditEventRepository.findAllByOrderBySequenceNumberAsc();
        String currentPrev = GENESIS_HASH;
        for (AuditEvent event : events) {
            event.setPreviousHash(currentPrev);
            String canonicalPayload = String.format("%d|%s|%s|%s|%s|%s|%d|%s",
                    event.getSequenceNumber(), event.getTimestamp(), event.getActorUsername(),
                    event.getActorRole(), event.getEventType(), event.getEntityType(),
                    event.getEntityId() != null ? event.getEntityId() : 0L, event.getDescription().trim());
            event.setCanonicalPayload(canonicalPayload);
            String hash = calculateSha256(currentPrev + "|" + canonicalPayload);
            event.setCurrentHash(hash);
            auditEventRepository.save(event);
            currentPrev = hash;
        }
    }

    public static String calculateSha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : encodedHash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}

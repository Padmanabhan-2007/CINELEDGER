package com.cineledger.controller;

import com.cineledger.dto.ApiResponse;
import com.cineledger.dto.AuditVerifyResponse;
import com.cineledger.entity.AuditEvent;
import com.cineledger.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/audit")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditEvent>>> getAllAuditEvents(@RequestParam(value = "all", defaultValue = "false") boolean all) {
        List<AuditEvent> events = all ? auditService.getAllEvents() : auditService.getRecentEvents();
        return ResponseEntity.ok(ApiResponse.success(events));
    }

    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<AuditVerifyResponse>> verifyAuditChain() {
        AuditVerifyResponse response = auditService.verifyAuditChain();
        return ResponseEntity.ok(ApiResponse.success("Cryptographic SHA-256 verification complete", response));
    }

    @PostMapping("/tamper-test")
    public ResponseEntity<ApiResponse<Map<String, Object>>> tamperTest(@RequestBody(required = false) Map<String, Object> payload) {
        List<AuditEvent> events = auditService.getAllEvents();
        if (events.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Audit trail is empty. Perform actions first."));
        }
        Long eventId = events.get(0).getId();
        if (payload != null && payload.containsKey("eventId")) {
            eventId = Long.valueOf(payload.get("eventId").toString());
        }
        String desc = (payload != null && payload.containsKey("description"))
                ? payload.get("description").toString() : "MALICIOUS_UNAUTHORIZED_ALTERATION_WITHOUT_REHASHING";

        AuditEvent tampered = auditService.tamperEventForTesting(eventId, desc);

        // Immediately check verification to prove failure
        AuditVerifyResponse verifyResult = auditService.verifyAuditChain();

        return ResponseEntity.ok(ApiResponse.success("Tamper simulation executed on event ID " + eventId, Map.of(
                "tamperedEventId", eventId,
                "tamperedDescription", tampered.getDescription(),
                "integrityCheckAfterTamper", verifyResult
        )));
    }

    @PostMapping("/restore-chain")
    public ResponseEntity<ApiResponse<AuditVerifyResponse>> restoreChain() {
        auditService.restoreChain();
        AuditVerifyResponse verifyResult = auditService.verifyAuditChain();
        return ResponseEntity.ok(ApiResponse.success("Audit chain cryptographic hashes re-anchored successfully", verifyResult));
    }
}

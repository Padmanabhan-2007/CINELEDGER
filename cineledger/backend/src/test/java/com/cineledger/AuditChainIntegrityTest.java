package com.cineledger;

import com.cineledger.dto.AuditVerifyResponse;
import com.cineledger.entity.AuditEvent;
import com.cineledger.repository.AuditEventRepository;
import com.cineledger.service.AuditService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class AuditChainIntegrityTest {
    @Autowired
    private AuditService auditService;
    @Autowired
    private AuditEventRepository auditEventRepository;

    @BeforeEach
    void setUp() {
        auditEventRepository.deleteAll();
    }

    @Test
    @DisplayName("Should build an intact cryptographic SHA-256 hash chain across multiple events")
    void testValidAuditChainVerification() {
        auditService.recordEvent("analyst@cineledger.io", "ANALYST", "REPORT_IMPORT", "REPORT", 1L,
                "Imported POS records");
        auditService.recordEvent("analyst@cineledger.io", "ANALYST", "RECONCILIATION_RUN", "RECONCILIATION", 1L,
                "Ran reconciliation");
        auditService.recordEvent("auditor@cineledger.io", "AUDITOR", "SETTLEMENT_APPROVED", "SETTLEMENT", 1L,
                "Approved settlement payout");

        AuditVerifyResponse response = auditService.verifyAuditChain();

        assertTrue(response.isValid(), "Audit chain should be valid and unbroken");
        assertEquals(3, response.getTotalEvents());
        assertNull(response.getBrokenEventId());
        assertTrue(response.getMessage().contains("verified intact"));
    }

    @Test
    @DisplayName("Should detect tampering when an audit event description is modified without re-anchoring")
    void testTamperDetectionFailure() {
        AuditEvent e1 = auditService.recordEvent("analyst@cineledger.io", "ANALYST", "REPORT_IMPORT", "REPORT", 1L,
                "Legitimate import");
        AuditEvent e2 = auditService.recordEvent("analyst@cineledger.io", "ANALYST", "RECONCILIATION_RUN",
                "RECONCILIATION", 1L, "Clean run");

        // Tamper with event 1
        auditService.tamperEventForTesting(e1.getId(), "TAMPERED_FRAUDULENT_DESCRIPTION");

        AuditVerifyResponse response = auditService.verifyAuditChain();

        assertFalse(response.isValid(), "Audit verification must fail when payload is tampered");
        assertEquals(e1.getId(), response.getBrokenEventId(), "Should identify the exact corrupted event ID");
        assertTrue(response.getMessage().contains("altered") || response.getMessage().contains("Cryptographic"));
    }
}

package com.cineledger.controller;

import com.cineledger.dto.ApiResponse;
import com.cineledger.dto.SettlementCalculationResponse;
import com.cineledger.service.SettlementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settlements")
public class SettlementController {

    private final SettlementService settlementService;

    public SettlementController(SettlementService settlementService) {
        this.settlementService = settlementService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SettlementCalculationResponse>>> getAllSettlements() {
        List<SettlementCalculationResponse> settlements = settlementService.getAllSettlements();
        return ResponseEntity.ok(ApiResponse.success(settlements));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SettlementCalculationResponse>> getSettlementById(@PathVariable Long id) {
        SettlementCalculationResponse settlement = settlementService.getSettlementById(id);
        return ResponseEntity.ok(ApiResponse.success(settlement));
    }

    @GetMapping("/reconciliation/{reconciliationId}")
    public ResponseEntity<ApiResponse<SettlementCalculationResponse>> getByReconciliationId(@PathVariable Long reconciliationId) {
        return settlementService.getSettlementByReconciliationId(reconciliationId)
                .map(s -> ResponseEntity.ok(ApiResponse.success(s)))
                .orElse(ResponseEntity.ok(ApiResponse.success("No settlement calculated yet", null)));
    }

    @PostMapping("/calculate")
    public ResponseEntity<ApiResponse<SettlementCalculationResponse>> calculateSettlement(
            @RequestBody Map<String, Object> payload,
            Authentication auth) {
        if (!payload.containsKey("reconciliationId")) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Field 'reconciliationId' is required"));
        }
        Long reconciliationId = Long.valueOf(payload.get("reconciliationId").toString());
        Long contractId = payload.containsKey("contractId") && payload.get("contractId") != null
                ? Long.valueOf(payload.get("contractId").toString()) : null;

        String username = auth != null ? auth.getName() : "analyst@cineledger.io";
        String role = auth != null && !auth.getAuthorities().isEmpty()
                ? auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")
                : "ANALYST";

        SettlementCalculationResponse calculated = settlementService.calculateSettlement(reconciliationId, contractId, username, role);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Contract terms applied and settlement calculated", calculated));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<SettlementCalculationResponse>> approveSettlement(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> payload,
            Authentication auth) {
        String paymentRef = (payload != null && payload.containsKey("paymentReference"))
                ? payload.get("paymentReference") : "TXN-AUTO-" + System.currentTimeMillis();

        String username = auth != null ? auth.getName() : "auditor@cineledger.io";
        String role = auth != null && !auth.getAuthorities().isEmpty()
                ? auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")
                : "AUDITOR";

        SettlementCalculationResponse approved = settlementService.approveSettlement(id, paymentRef, username, role);
        return ResponseEntity.ok(ApiResponse.success("Settlement approved and authorized for payout", approved));
    }
}

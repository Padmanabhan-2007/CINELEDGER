package com.cineledger.controller;

import com.cineledger.dto.ApiResponse;
import com.cineledger.dto.ReconciliationCreateRequest;
import com.cineledger.dto.ReconciliationResponse;
import com.cineledger.entity.Discrepancy;
import com.cineledger.security.JwtTokenProvider;
import com.cineledger.service.ImportService;
import com.cineledger.service.ReconciliationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reconciliations")
public class ReconciliationController {

    private final ReconciliationService reconciliationService;
    private final ImportService importService;
    private final JwtTokenProvider tokenProvider;

    public ReconciliationController(ReconciliationService reconciliationService,
                                    ImportService importService,
                                    JwtTokenProvider tokenProvider) {
        this.reconciliationService = reconciliationService;
        this.importService = importService;
        this.tokenProvider = tokenProvider;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReconciliationResponse>>> getAllReconciliations() {
        List<ReconciliationResponse> list = reconciliationService.getAllReconciliations();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReconciliationResponse>> getReconciliationById(@PathVariable Long id) {
        ReconciliationResponse response = reconciliationService.getReconciliationById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReconciliationResponse>> createReconciliation(
            @Valid @RequestBody ReconciliationCreateRequest request,
            Authentication auth,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        String username = auth != null ? auth.getName() : "analyst@cineledger.io";
        String role = auth != null && !auth.getAuthorities().isEmpty()
                ? auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")
                : "ANALYST";
        Long userId = 1L;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (tokenProvider.validateToken(token)) {
                userId = tokenProvider.getUserIdFromToken(token);
            }
        }

        ReconciliationResponse created = reconciliationService.createReconciliation(request, username, role, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Reconciliation created successfully", created));
    }

    @PostMapping("/{id}/run")
    public ResponseEntity<ApiResponse<ReconciliationResponse>> runReconciliation(
            @PathVariable Long id,
            Authentication auth) {
        String username = auth != null ? auth.getName() : "analyst@cineledger.io";
        String role = auth != null && !auth.getAuthorities().isEmpty()
                ? auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")
                : "ANALYST";

        ReconciliationResponse result = reconciliationService.runReconciliation(id, username, role);
        return ResponseEntity.ok(ApiResponse.success("Reconciliation engine executed successfully", result));
    }

    @GetMapping("/{id}/discrepancies")
    public ResponseEntity<ApiResponse<List<Discrepancy>>> getDiscrepancies(@PathVariable Long id) {
        List<Discrepancy> list = reconciliationService.getDiscrepancies(id);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/{id}/imports")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadSourceReport(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "reportType", defaultValue = "THEATRE_POS") String reportType,
            Authentication auth) {
        String username = auth != null ? auth.getName() : "analyst@cineledger.io";
        String role = auth != null && !auth.getAuthorities().isEmpty()
                ? auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")
                : "ANALYST";

        Map<String, Object> result = importService.importCsvReport(id, reportType, file, username, role);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Source report imported successfully", result));
    }
}

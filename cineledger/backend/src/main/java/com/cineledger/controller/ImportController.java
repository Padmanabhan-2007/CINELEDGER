package com.cineledger.controller;

import com.cineledger.dto.ApiResponse;
import com.cineledger.entity.SourceReport;
import com.cineledger.service.ImportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/imports")
public class ImportController {

    private final ImportService importService;

    public ImportController(ImportService importService) {
        this.importService = importService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> importReport(
            @RequestParam("reconciliationId") Long reconciliationId,
            @RequestParam(value = "reportType", defaultValue = "THEATRE_POS") String reportType,
            @RequestParam("file") MultipartFile file,
            Authentication auth) {
        String username = auth != null ? auth.getName() : "analyst@cineledger.io";
        String role = auth != null && !auth.getAuthorities().isEmpty()
                ? auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")
                : "ANALYST";

        Map<String, Object> result = importService.importCsvReport(reconciliationId, reportType, file, username, role);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("CSV file successfully parsed and transactions stored", result));
    }

    @GetMapping("/{reconciliationId}")
    public ResponseEntity<ApiResponse<List<SourceReport>>> getReportsForReconciliation(@PathVariable Long reconciliationId) {
        List<SourceReport> reports = importService.getReportsForReconciliation(reconciliationId);
        return ResponseEntity.ok(ApiResponse.success(reports));
    }
}

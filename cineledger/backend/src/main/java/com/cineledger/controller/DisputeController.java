package com.cineledger.controller;

import com.cineledger.dto.ApiResponse;
import com.cineledger.dto.DisputeCommentRequest;
import com.cineledger.dto.DisputeCorrectionRequest;
import com.cineledger.dto.DisputeCreateRequest;
import com.cineledger.dto.DisputeResponse;
import com.cineledger.security.JwtTokenProvider;
import com.cineledger.service.DisputeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/disputes")
public class DisputeController {

    private final DisputeService disputeService;
    private final JwtTokenProvider tokenProvider;

    public DisputeController(DisputeService disputeService, JwtTokenProvider tokenProvider) {
        this.disputeService = disputeService;
        this.tokenProvider = tokenProvider;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DisputeResponse>>> getAllDisputes(@RequestParam(required = false) String status) {
        List<DisputeResponse> disputes = disputeService.getAllDisputes(status);
        return ResponseEntity.ok(ApiResponse.success(disputes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DisputeResponse>> getDisputeById(@PathVariable Long id) {
        DisputeResponse dispute = disputeService.getDisputeById(id);
        return ResponseEntity.ok(ApiResponse.success(dispute));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DisputeResponse>> createDispute(
            @Valid @RequestBody DisputeCreateRequest request,
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

        DisputeResponse created = disputeService.createDispute(request, username, role, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Dispute case opened successfully", created));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<DisputeResponse>> addComment(
            @PathVariable Long id,
            @Valid @RequestBody DisputeCommentRequest request,
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

        DisputeResponse updated = disputeService.addComment(id, request.getCommentText(), userId, username, role);
        return ResponseEntity.ok(ApiResponse.success("Comment added", updated));
    }

    @PostMapping("/{id}/evidence")
    public ResponseEntity<ApiResponse<DisputeResponse>> attachEvidence(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload,
            Authentication auth) {
        String fileName = payload.getOrDefault("fileName", "supporting_evidence.pdf").toString();
        Long fileSize = payload.containsKey("fileSizeBytes") ? Long.valueOf(payload.get("fileSizeBytes").toString()) : 2048L;
        String fileType = payload.getOrDefault("fileType", "PDF").toString();
        String fileUrl = payload.getOrDefault("fileUrl", "/attachments/" + fileName).toString();
        String description = payload.getOrDefault("description", "Exhibitor settlement statement evidence").toString();

        String username = auth != null ? auth.getName() : "analyst@cineledger.io";
        String role = auth != null && !auth.getAuthorities().isEmpty()
                ? auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")
                : "ANALYST";

        DisputeResponse updated = disputeService.attachEvidence(id, fileName, fileSize, fileType, fileUrl, description, username, role);
        return ResponseEntity.ok(ApiResponse.success("Evidence attached", updated));
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<DisputeResponse>> resolveDispute(
            @PathVariable Long id,
            @Valid @RequestBody DisputeCorrectionRequest request,
            Authentication auth) {
        String username = auth != null ? auth.getName() : "auditor@cineledger.io";
        String role = auth != null && !auth.getAuthorities().isEmpty()
                ? auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")
                : "AUDITOR";

        DisputeResponse resolved = disputeService.resolveOrReject(id, request, username, role);
        return ResponseEntity.ok(ApiResponse.success("Dispute resolution saved", resolved));
    }
}

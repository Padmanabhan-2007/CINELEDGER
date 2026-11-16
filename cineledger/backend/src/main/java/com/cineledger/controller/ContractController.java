package com.cineledger.controller;

import com.cineledger.dto.ApiResponse;
import com.cineledger.dto.ContractDto;
import com.cineledger.service.ContractService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    private final ContractService contractService;

    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContractDto>>> getAllContracts() {
        List<ContractDto> contracts = contractService.getAllContracts();
        return ResponseEntity.ok(ApiResponse.success(contracts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContractDto>> getContractById(@PathVariable Long id) {
        ContractDto contract = contractService.getContractById(id);
        return ResponseEntity.ok(ApiResponse.success(contract));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ContractDto>> createContract(@Valid @RequestBody ContractDto dto, Authentication auth) {
        String username = auth != null ? auth.getName() : "admin@cineledger.io";
        String role = auth != null && !auth.getAuthorities().isEmpty()
                ? auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")
                : "ADMIN";
        ContractDto created = contractService.createContract(dto, username, role);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Contract created successfully", created));
    }
}

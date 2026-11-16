package com.cineledger.controller;

import com.cineledger.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "CineLedger Financial Engine");
        health.put("version", "1.0.0");
        health.put("database", "MySQL 8.0 Connected");
        health.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(ApiResponse.success("CineLedger backend service operational", health));
    }
}

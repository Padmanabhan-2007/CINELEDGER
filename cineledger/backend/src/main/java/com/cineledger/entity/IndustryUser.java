package com.cineledger.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "industry_users", indexes = {
    @Index(name = "idx_ind_user_email", columnList = "email", unique = true),
    @Index(name = "idx_ind_user_org", columnList = "organization_id")
})
public class IndustryUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 40)
    private String role; // ADMIN, ANALYST, AUDITOR, DISTRIBUTOR, EXHIBITOR

    @Column(name = "organization_id")
    private Long organizationId;

    @Column(name = "organization_name", length = 120)
    private String organizationName;

    @Column(name = "designation", length = 100)
    private String designation;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public IndustryUser() {}

    public IndustryUser(String email, String fullName, String password, String role,
                        Long organizationId, String organizationName, String designation) {
        this.email = email != null ? email.trim().toLowerCase() : null;
        this.fullName = fullName;
        this.password = password;
        this.role = role;
        this.organizationId = organizationId;
        this.organizationName = organizationName;
        this.designation = designation;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email != null ? email.trim().toLowerCase() : null; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long organizationId) { this.organizationId = organizationId; }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

package com.cineledger.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String type; // STUDIO, DISTRIBUTOR, EXHIBITOR_CHAIN, AUDIT_FIRM

    @Column(length = 100)
    private String contactEmail;

    @Column(unique = true, length = 20)
    private String code;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Organization() {}

    public Organization(String name, String type, String contactEmail, String code) {
        this.name = name;
        this.type = type;
        this.contactEmail = contactEmail;
        this.code = code;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

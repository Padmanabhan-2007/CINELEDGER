package com.cineledger.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cinemaholic_users", indexes = {
    @Index(name = "idx_cnh_user_email", columnList = "email", unique = true)
})
public class CinemaholicUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(length = 30)
    private String phone;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "membership_tier", length = 60)
    private String membershipTier = "VIP Premiere Club";

    @Column(name = "preferred_format", length = 60)
    private String preferredFormat = "IMAX 4K Dual Laser";

    @Column(name = "loyalty_points")
    private Integer loyaltyPoints = 250;

    @Column(name = "city", length = 50)
    private String city = "Mumbai";

    @Column(name = "role", length = 30)
    private String role = "ROLE_AUDIENCE";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public CinemaholicUser() {}

    public CinemaholicUser(String email, String fullName, String phone, String password,
                           String membershipTier, String preferredFormat, Integer loyaltyPoints, String city) {
        this.email = email != null ? email.trim().toLowerCase() : null;
        this.fullName = fullName;
        this.phone = phone;
        this.password = password;
        this.membershipTier = membershipTier != null ? membershipTier : "VIP Premiere Club";
        this.preferredFormat = preferredFormat != null ? preferredFormat : "IMAX 4K Dual Laser";
        this.loyaltyPoints = loyaltyPoints != null ? loyaltyPoints : 250;
        this.city = city != null ? city : "Mumbai";
        this.role = "ROLE_AUDIENCE";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email != null ? email.trim().toLowerCase() : null; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getMembershipTier() { return membershipTier; }
    public void setMembershipTier(String membershipTier) { this.membershipTier = membershipTier; }

    public String getPreferredFormat() { return preferredFormat; }
    public void setPreferredFormat(String preferredFormat) { this.preferredFormat = preferredFormat; }

    public Integer getLoyaltyPoints() { return loyaltyPoints; }
    public void setLoyaltyPoints(Integer loyaltyPoints) { this.loyaltyPoints = loyaltyPoints; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

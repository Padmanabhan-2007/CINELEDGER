package com.cineledger.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_events", indexes = {
    @Index(name = "idx_audit_seq", columnList = "sequence_number"),
    @Index(name = "idx_audit_entity", columnList = "entity_type, entity_id")
})
public class AuditEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sequence_number", nullable = false)
    private Long sequenceNumber;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(name = "actor_username", nullable = false, length = 100)
    private String actorUsername;

    @Column(name = "actor_role", length = 50)
    private String actorRole;

    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType;

    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "canonical_payload", nullable = false, columnDefinition = "TEXT")
    private String canonicalPayload;

    @Column(name = "previous_hash", nullable = false, length = 64)
    private String previousHash;

    @Column(name = "current_hash", nullable = false, length = 64)
    private String currentHash;

    public AuditEvent() {}

    public AuditEvent(Long sequenceNumber, LocalDateTime timestamp, String actorUsername, String actorRole,
                      String eventType, String entityType, Long entityId, String description,
                      String canonicalPayload, String previousHash, String currentHash) {
        this.sequenceNumber = sequenceNumber;
        this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
        this.actorUsername = actorUsername;
        this.actorRole = actorRole;
        this.eventType = eventType;
        this.entityType = entityType;
        this.entityId = entityId;
        this.description = description;
        this.canonicalPayload = canonicalPayload;
        this.previousHash = previousHash;
        this.currentHash = currentHash;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSequenceNumber() { return sequenceNumber; }
    public void setSequenceNumber(Long sequenceNumber) { this.sequenceNumber = sequenceNumber; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getActorUsername() { return actorUsername; }
    public void setActorUsername(String actorUsername) { this.actorUsername = actorUsername; }

    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCanonicalPayload() { return canonicalPayload; }
    public void setCanonicalPayload(String canonicalPayload) { this.canonicalPayload = canonicalPayload; }

    public String getPreviousHash() { return previousHash; }
    public void setPreviousHash(String previousHash) { this.previousHash = previousHash; }

    public String getCurrentHash() { return currentHash; }
    public void setCurrentHash(String currentHash) { this.currentHash = currentHash; }
}

package com.cineledger.repository;

import com.cineledger.entity.AuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuditEventRepository extends JpaRepository<AuditEvent, Long> {
    List<AuditEvent> findAllByOrderBySequenceNumberAsc();
    List<AuditEvent> findAllByOrderBySequenceNumberDesc();
    List<AuditEvent> findTop50ByOrderBySequenceNumberDesc();
    Optional<AuditEvent> findTopByOrderBySequenceNumberDesc();
    List<AuditEvent> findByEntityTypeAndEntityIdOrderBySequenceNumberAsc(String entityType, Long entityId);
}

package com.cineledger.repository;

import com.cineledger.entity.EvidenceAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvidenceAttachmentRepository extends JpaRepository<EvidenceAttachment, Long> {
    List<EvidenceAttachment> findByDisputeIdOrderByUploadedAtAsc(Long disputeId);
}

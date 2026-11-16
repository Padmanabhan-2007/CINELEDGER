package com.cineledger.repository;

import com.cineledger.entity.DisputeComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisputeCommentRepository extends JpaRepository<DisputeComment, Long> {
    List<DisputeComment> findByDisputeIdOrderByCreatedAtAsc(Long disputeId);
}

package com.cineledger.repository;

import com.cineledger.entity.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    Optional<Dispute> findByDisputeNumber(String disputeNumber);
    List<Dispute> findByReconciliationId(Long reconciliationId);
    List<Dispute> findByStatus(String status);
    List<Dispute> findAllByOrderByCreatedAtDesc();
    long countByStatus(String status);
}

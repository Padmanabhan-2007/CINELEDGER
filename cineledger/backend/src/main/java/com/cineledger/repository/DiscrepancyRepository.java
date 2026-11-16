package com.cineledger.repository;

import com.cineledger.entity.Discrepancy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiscrepancyRepository extends JpaRepository<Discrepancy, Long> {
    List<Discrepancy> findByReconciliationId(Long reconciliationId);
    List<Discrepancy> findByStatus(String status);
    Optional<Discrepancy> findByDiscrepancyCode(String discrepancyCode);
    void deleteByReconciliationId(Long reconciliationId);
    long countByStatus(String status);
}

package com.cineledger.repository;

import com.cineledger.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, Long> {
    Optional<Settlement> findBySettlementNumber(String settlementNumber);
    Optional<Settlement> findByReconciliationId(Long reconciliationId);
    List<Settlement> findByContractId(Long contractId);
    List<Settlement> findByStatus(String status);
    List<Settlement> findAllByOrderByCreatedAtDesc();
    long countByStatus(String status);
}

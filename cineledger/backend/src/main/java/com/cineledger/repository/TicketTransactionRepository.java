package com.cineledger.repository;

import com.cineledger.entity.TicketTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketTransactionRepository extends JpaRepository<TicketTransaction, Long> {
    List<TicketTransaction> findByReconciliationId(Long reconciliationId);
    List<TicketTransaction> findByReconciliationIdAndSourceType(Long reconciliationId, String sourceType);
    List<TicketTransaction> findBySourceReportId(Long sourceReportId);
    void deleteByReconciliationId(Long reconciliationId);
}

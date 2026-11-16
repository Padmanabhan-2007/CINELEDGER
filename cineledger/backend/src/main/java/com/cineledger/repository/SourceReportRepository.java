package com.cineledger.repository;

import com.cineledger.entity.SourceReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SourceReportRepository extends JpaRepository<SourceReport, Long> {
    List<SourceReport> findByReconciliationId(Long reconciliationId);
    List<SourceReport> findByReconciliationIdAndReportType(Long reconciliationId, String reportType);
}

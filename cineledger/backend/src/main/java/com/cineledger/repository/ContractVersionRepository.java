package com.cineledger.repository;

import com.cineledger.entity.ContractVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContractVersionRepository extends JpaRepository<ContractVersion, Long> {
    List<ContractVersion> findByContractIdOrderByVersionNumberDesc(Long contractId);

    @Query("SELECT cv FROM ContractVersion cv WHERE cv.contractId = :contractId AND cv.active = true " +
           "AND cv.effectiveFrom <= :targetDate " +
           "AND (cv.effectiveTo IS NULL OR cv.effectiveTo >= :targetDate) " +
           "ORDER BY cv.versionNumber DESC")
    List<ContractVersion> findEffectiveVersions(@Param("contractId") Long contractId, @Param("targetDate") LocalDate targetDate);

    default Optional<ContractVersion> findEffectiveVersion(Long contractId, LocalDate targetDate) {
        List<ContractVersion> versions = findEffectiveVersions(contractId, targetDate);
        return versions.isEmpty() ? Optional.empty() : Optional.of(versions.get(0));
    }
}

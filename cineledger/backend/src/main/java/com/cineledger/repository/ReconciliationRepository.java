package com.cineledger.repository;

import com.cineledger.entity.Reconciliation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReconciliationRepository extends JpaRepository<Reconciliation, Long> {
    Optional<Reconciliation> findByReconciliationNumber(String reconciliationNumber);
    List<Reconciliation> findByFilmId(Long filmId);
    List<Reconciliation> findByCinemaId(Long cinemaId);
    List<Reconciliation> findByStatus(String status);
    List<Reconciliation> findAllByOrderByCreatedAtDesc();
}

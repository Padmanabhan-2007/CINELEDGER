package com.cineledger.repository;

import com.cineledger.entity.AuditoriumLayout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuditoriumLayoutRepository extends JpaRepository<AuditoriumLayout, Long> {
    Optional<AuditoriumLayout> findByScreenId(Long screenId);
}


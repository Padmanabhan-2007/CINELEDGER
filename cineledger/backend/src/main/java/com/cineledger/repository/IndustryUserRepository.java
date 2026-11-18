package com.cineledger.repository;

import com.cineledger.entity.IndustryUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IndustryUserRepository extends JpaRepository<IndustryUser, Long> {
    Optional<IndustryUser> findByEmail(String email);
    boolean existsByEmail(String email);
}

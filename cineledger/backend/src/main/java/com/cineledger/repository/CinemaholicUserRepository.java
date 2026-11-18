package com.cineledger.repository;

import com.cineledger.entity.CinemaholicUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CinemaholicUserRepository extends JpaRepository<CinemaholicUser, Long> {
    Optional<CinemaholicUser> findByEmail(String email);
    boolean existsByEmail(String email);
}

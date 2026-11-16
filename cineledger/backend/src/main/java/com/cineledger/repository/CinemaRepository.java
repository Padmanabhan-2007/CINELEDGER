package com.cineledger.repository;

import com.cineledger.entity.Cinema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CinemaRepository extends JpaRepository<Cinema, Long> {
    Optional<Cinema> findByCode(String code);
    List<Cinema> findByCityIgnoreCase(String city);
}

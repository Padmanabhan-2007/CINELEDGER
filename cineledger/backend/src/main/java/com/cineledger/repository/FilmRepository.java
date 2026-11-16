package com.cineledger.repository;

import com.cineledger.entity.Film;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FilmRepository extends JpaRepository<Film, Long> {
    Optional<Film> findByCode(String code);
    List<Film> findByStatus(String status);
    List<Film> findByTitleContainingIgnoreCase(String query);
}

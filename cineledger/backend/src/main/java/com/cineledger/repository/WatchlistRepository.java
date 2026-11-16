package com.cineledger.repository;

import com.cineledger.entity.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    List<Watchlist> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Watchlist> findByUserIdAndFilmId(Long userId, Long filmId);
    boolean existsByUserIdAndFilmId(Long userId, Long filmId);
    void deleteByUserIdAndFilmId(Long userId, Long filmId);
    long countByFilmId(Long filmId);
}


package com.cineledger.repository;

import com.cineledger.entity.MovieReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieReviewRepository extends JpaRepository<MovieReview, Long> {

    List<MovieReview> findByFilmIdOrderByCreatedAtDesc(Long filmId);

    List<MovieReview> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<MovieReview> findByUserIdAndFilmId(Long userId, Long filmId);

    boolean existsByUserIdAndFilmId(Long userId, Long filmId);

    long countByFilmId(Long filmId);

    @Query("SELECT r.ratingCategory, COUNT(r) FROM MovieReview r WHERE r.filmId = :filmId GROUP BY r.ratingCategory")
    List<Object[]> countByRatingCategoryForFilm(@Param("filmId") Long filmId);
}


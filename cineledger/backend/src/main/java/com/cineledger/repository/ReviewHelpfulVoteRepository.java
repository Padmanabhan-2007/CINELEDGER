package com.cineledger.repository;

import com.cineledger.entity.ReviewHelpfulVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewHelpfulVoteRepository extends JpaRepository<ReviewHelpfulVote, Long> {
    boolean existsByReviewIdAndUserId(Long reviewId, Long userId);
    Optional<ReviewHelpfulVote> findByReviewIdAndUserId(Long reviewId, Long userId);
    long countByReviewId(Long reviewId);
    void deleteByReviewIdAndUserId(Long reviewId, Long userId);
}


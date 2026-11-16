package com.cineledger.service;

import com.cineledger.dto.MovieReviewDto;
import com.cineledger.dto.MovieReviewRequest;
import com.cineledger.dto.ReviewDistributionDto;
import com.cineledger.entity.*;
import com.cineledger.exception.ConflictException;
import com.cineledger.exception.ResourceNotFoundException;
import com.cineledger.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MovieReviewService {

    private final MovieReviewRepository movieReviewRepository;
    private final ReviewHelpfulVoteRepository reviewHelpfulVoteRepository;
    private final FilmRepository filmRepository;
    private final BookingRepository bookingRepository;
    private final MovieShowtimeRepository movieShowtimeRepository;

    public MovieReviewService(MovieReviewRepository movieReviewRepository,
                              ReviewHelpfulVoteRepository reviewHelpfulVoteRepository,
                              FilmRepository filmRepository,
                              BookingRepository bookingRepository,
                              MovieShowtimeRepository movieShowtimeRepository) {
        this.movieReviewRepository = movieReviewRepository;
        this.reviewHelpfulVoteRepository = reviewHelpfulVoteRepository;
        this.filmRepository = filmRepository;
        this.bookingRepository = bookingRepository;
        this.movieShowtimeRepository = movieShowtimeRepository;
    }

    public List<MovieReviewDto> getReviewsForFilm(Long filmId, Long currentUserId) {
        List<MovieReview> reviews = movieReviewRepository.findByFilmIdOrderByCreatedAtDesc(filmId);
        return reviews.stream().map(r -> toDto(r, currentUserId)).collect(Collectors.toList());
    }

    public ReviewDistributionDto getReviewDistribution(Long filmId) {
        List<MovieReview> reviews = movieReviewRepository.findByFilmIdOrderByCreatedAtDesc(filmId);

        long total = reviews.size();
        long perfection = 0;
        long good = 0;
        long average = 0;
        long timepass = 0;
        long skip = 0;

        for (MovieReview r : reviews) {
            String cat = r.getRatingCategory() != null ? r.getRatingCategory().toUpperCase() : "AVERAGE";
            switch (cat) {
                case "PERFECTION": perfection++; break;
                case "GOOD": good++; break;
                case "AVERAGE": average++; break;
                case "TIMEPASS": timepass++; break;
                case "SKIP": skip++; break;
                default: average++; break;
            }
        }

        ReviewDistributionDto dto = new ReviewDistributionDto();
        dto.setFilmId(filmId);
        dto.setTotalReviews(total);
        dto.setPerfectionCount(perfection);
        dto.setGoodCount(good);
        dto.setAverageCount(average);
        dto.setTimepassCount(timepass);
        dto.setSkipCount(skip);

        if (total > 0) {
            dto.setPerfectionPercent(Math.round((perfection * 100.0 / total) * 10.0) / 10.0);
            dto.setGoodPercent(Math.round((good * 100.0 / total) * 10.0) / 10.0);
            dto.setAveragePercent(Math.round((average * 100.0 / total) * 10.0) / 10.0);
            dto.setTimepassPercent(Math.round((timepass * 100.0 / total) * 10.0) / 10.0);
            dto.setSkipPercent(Math.round((skip * 100.0 / total) * 10.0) / 10.0);

            // Weighted score out of 10.0 (Perfection: 10, Good: 8, Average: 6, Timepass: 4, Skip: 2)
            double weightedSum = (perfection * 10.0) + (good * 8.0) + (average * 6.0) + (timepass * 4.0) + (skip * 2.0);
            double score = Math.round((weightedSum / total) * 10.0) / 10.0;
            dto.setRatingScore(score);

            if (score >= 8.5) {
                dto.setConsensusRating("PERFECTION");
            } else if (score >= 7.0) {
                dto.setConsensusRating("GOOD");
            } else if (score >= 5.0) {
                dto.setConsensusRating("AVERAGE");
            } else if (score >= 3.5) {
                dto.setConsensusRating("TIMEPASS");
            } else {
                dto.setConsensusRating("SKIP");
            }
        } else {
            dto.setPerfectionPercent(0);
            dto.setGoodPercent(0);
            dto.setAveragePercent(0);
            dto.setTimepassPercent(0);
            dto.setSkipPercent(0);
            dto.setRatingScore(0.0);
            dto.setConsensusRating("NOT_YET_RATED");
        }

        return dto;
    }

    @Transactional
    public MovieReviewDto addReview(MovieReviewRequest request, Long userId, String userName) {
        if (movieReviewRepository.existsByUserIdAndFilmId(userId, request.getFilmId())) {
            throw new ConflictException("You have already reviewed this film. One review allowed per film.");
        }

        Film film = filmRepository.findById(request.getFilmId())
                .orElseThrow(() -> new ResourceNotFoundException("Film not found with id: " + request.getFilmId()));

        // Check if verified buyer (has a confirmed booking for any showtime of this film)
        boolean isVerified = false;
        List<Booking> userBookings = bookingRepository.findByUserIdAndStatus(userId, "CONFIRMED");
        for (Booking b : userBookings) {
            Optional<MovieShowtime> st = movieShowtimeRepository.findById(b.getShowtimeId());
            if (st.isPresent() && st.get().getFilmId().equals(film.getId())) {
                isVerified = true;
                break;
            }
        }

        MovieReview review = new MovieReview();
        review.setFilmId(film.getId());
        review.setUserId(userId);
        review.setUserName(userName != null ? userName : "Movie Lover");
        review.setRatingCategory(request.getRatingCategory().toUpperCase());
        review.setTitle(request.getTitle() != null ? request.getTitle().trim() : null);
        review.setComment(request.getComment().trim());
        review.setIsVerifiedBuyer(isVerified);
        review.setHelpfulVotes(0);
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());

        MovieReview saved = movieReviewRepository.save(review);
        return toDto(saved, userId);
    }

    @Transactional
    public MovieReviewDto toggleHelpfulVote(Long reviewId, Long userId) {
        MovieReview review = movieReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        boolean alreadyVoted = reviewHelpfulVoteRepository.existsByReviewIdAndUserId(reviewId, userId);
        if (alreadyVoted) {
            reviewHelpfulVoteRepository.deleteByReviewIdAndUserId(reviewId, userId);
            review.setHelpfulVotes(Math.max(0, review.getHelpfulVotes() - 1));
        } else {
            reviewHelpfulVoteRepository.save(new ReviewHelpfulVote(reviewId, userId));
            review.setHelpfulVotes(review.getHelpfulVotes() + 1);
        }

        MovieReview saved = movieReviewRepository.save(review);
        return toDto(saved, userId);
    }

    public List<MovieReviewDto> getUserReviews(Long userId) {
        List<MovieReview> reviews = movieReviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return reviews.stream().map(r -> toDto(r, userId)).collect(Collectors.toList());
    }

    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        MovieReview review = movieReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        if (!review.getUserId().equals(userId)) {
            throw new ConflictException("You can only delete your own reviews");
        }

        movieReviewRepository.delete(review);
    }

    private MovieReviewDto toDto(MovieReview review, Long currentUserId) {
        MovieReviewDto dto = new MovieReviewDto();
        dto.setId(review.getId());
        dto.setFilmId(review.getFilmId());
        dto.setUserId(review.getUserId());
        dto.setUserName(review.getUserName());
        dto.setRatingCategory(review.getRatingCategory());
        dto.setTitle(review.getTitle());
        dto.setComment(review.getComment());
        dto.setIsVerifiedBuyer(review.getIsVerifiedBuyer());
        dto.setHelpfulVotes(review.getHelpfulVotes());
        dto.setCreatedAt(review.getCreatedAt());

        filmRepository.findById(review.getFilmId()).ifPresent(f -> {
            dto.setFilmTitle(f.getTitle());
        });

        if (currentUserId != null) {
            dto.setUserHasVoted(reviewHelpfulVoteRepository.existsByReviewIdAndUserId(review.getId(), currentUserId));
        } else {
            dto.setUserHasVoted(false);
        }

        return dto;
    }
}


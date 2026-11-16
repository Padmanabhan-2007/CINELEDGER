package com.cineledger.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "movie_reviews", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_film_review", columnNames = {"user_id", "film_id"})
}, indexes = {
    @Index(name = "idx_review_film", columnList = "film_id"),
    @Index(name = "idx_review_rating", columnList = "rating_category")
})
public class MovieReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "film_id", nullable = false)
    private Long filmId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "user_name", nullable = false, length = 100)
    private String userName;

    @Column(name = "rating_category", nullable = false, length = 20)
    private String ratingCategory; // SKIP, TIMEPASS, AVERAGE, GOOD, PERFECTION

    @Column(name = "title", length = 150)
    private String title;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "is_verified_buyer")
    private Boolean isVerifiedBuyer = false;

    @Column(name = "helpful_votes")
    private Integer helpfulVotes = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public MovieReview() {}

    public MovieReview(Long filmId, Long userId, String userName, String ratingCategory, String title,
                       String comment, Boolean isVerifiedBuyer) {
        this.filmId = filmId;
        this.userId = userId;
        this.userName = userName;
        this.ratingCategory = ratingCategory;
        this.title = title;
        this.comment = comment;
        this.isVerifiedBuyer = isVerifiedBuyer != null ? isVerifiedBuyer : false;
        this.helpfulVotes = 0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFilmId() { return filmId; }
    public void setFilmId(Long filmId) { this.filmId = filmId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getRatingCategory() { return ratingCategory; }
    public void setRatingCategory(String ratingCategory) { this.ratingCategory = ratingCategory; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Boolean getIsVerifiedBuyer() { return isVerifiedBuyer; }
    public void setIsVerifiedBuyer(Boolean isVerifiedBuyer) { this.isVerifiedBuyer = isVerifiedBuyer; }

    public Integer getHelpfulVotes() { return helpfulVotes; }
    public void setHelpfulVotes(Integer helpfulVotes) { this.helpfulVotes = helpfulVotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}


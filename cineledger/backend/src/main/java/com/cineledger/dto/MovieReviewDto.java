package com.cineledger.dto;

import java.time.LocalDateTime;

public class MovieReviewDto {

    private Long id;
    private Long filmId;
    private String filmTitle;
    private Long userId;
    private String userName;
    private String ratingCategory;
    private String title;
    private String comment;
    private Boolean isVerifiedBuyer;
    private Integer helpfulVotes;
    private Boolean userHasVoted;
    private LocalDateTime createdAt;

    public MovieReviewDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFilmId() { return filmId; }
    public void setFilmId(Long filmId) { this.filmId = filmId; }

    public String getFilmTitle() { return filmTitle; }
    public void setFilmTitle(String filmTitle) { this.filmTitle = filmTitle; }

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

    public Boolean getUserHasVoted() { return userHasVoted; }
    public void setUserHasVoted(Boolean userHasVoted) { this.userHasVoted = userHasVoted; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}


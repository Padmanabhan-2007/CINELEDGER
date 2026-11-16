package com.cineledger.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class MovieReviewRequest {

    @NotNull(message = "Film ID is required")
    private Long filmId;

    @NotBlank(message = "Rating category is required")
    @Pattern(regexp = "SKIP|TIMEPASS|AVERAGE|GOOD|PERFECTION", message = "Rating must be SKIP, TIMEPASS, AVERAGE, GOOD, or PERFECTION")
    private String ratingCategory;

    private String title;

    @NotBlank(message = "Review comment is required")
    private String comment;

    public MovieReviewRequest() {}

    public Long getFilmId() { return filmId; }
    public void setFilmId(Long filmId) { this.filmId = filmId; }

    public String getRatingCategory() { return ratingCategory; }
    public void setRatingCategory(String ratingCategory) { this.ratingCategory = ratingCategory; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}


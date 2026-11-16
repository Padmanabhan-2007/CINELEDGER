package com.cineledger.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class FilmDto {

    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String originalTitle;

    @NotBlank(message = "Film code is required")
    private String code;

    @NotNull(message = "Release year is required")
    private Integer releaseYear;

    private Integer durationMinutes;
    private String language;
    private String rating;
    private String genre;

    @NotBlank(message = "Poster URL reference is required")
    private String posterUrl;

    private String synopsis;
    private Long distributorId;
    private String distributorName;
    private String status;
    private Integer activeReconciliationsCount;

    public FilmDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getOriginalTitle() { return originalTitle; }
    public void setOriginalTitle(String originalTitle) { this.originalTitle = originalTitle; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }

    public Long getDistributorId() { return distributorId; }
    public void setDistributorId(Long distributorId) { this.distributorId = distributorId; }

    public String getDistributorName() { return distributorName; }
    public void setDistributorName(String distributorName) { this.distributorName = distributorName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getActiveReconciliationsCount() { return activeReconciliationsCount; }
    public void setActiveReconciliationsCount(Integer activeReconciliationsCount) { this.activeReconciliationsCount = activeReconciliationsCount; }
}

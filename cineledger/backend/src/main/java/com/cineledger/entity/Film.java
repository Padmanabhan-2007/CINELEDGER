package com.cineledger.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "films")
public class Film {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "original_title", length = 150)
    private String originalTitle;

    @Column(unique = true, nullable = false, length = 30)
    private String code; // e.g. FLM-2026-001

    @Column(name = "release_year")
    private Integer releaseYear;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(length = 50)
    private String language;

    @Column(length = 20)
    private String rating; // PG-13, R, U/A

    @Column(length = 100)
    private String genre;

    @Column(name = "poster_url", nullable = false, length = 500)
    private String posterUrl;

    @Column(columnDefinition = "TEXT")
    private String synopsis;

    @Column(name = "distributor_id")
    private Long distributorId;

    @Column(length = 30)
    private String status = "ACTIVE"; // ACTIVE, ARCHIVED

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Film() {}

    public Film(String title, String originalTitle, String code, Integer releaseYear, Integer durationMinutes,
                String language, String rating, String genre, String posterUrl, String synopsis,
                Long distributorId, String status) {
        this.title = title;
        this.originalTitle = originalTitle;
        this.code = code;
        this.releaseYear = releaseYear;
        this.durationMinutes = durationMinutes;
        this.language = language;
        this.rating = rating;
        this.genre = genre;
        this.posterUrl = posterUrl;
        this.synopsis = synopsis;
        this.distributorId = distributorId;
        this.status = status != null ? status : "ACTIVE";
        this.createdAt = LocalDateTime.now();
    }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

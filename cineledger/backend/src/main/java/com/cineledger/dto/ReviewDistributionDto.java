package com.cineledger.dto;

public class ReviewDistributionDto {

    private Long filmId;
    private long totalReviews;
    private long perfectionCount;
    private long goodCount;
    private long averageCount;
    private long timepassCount;
    private long skipCount;
    private double perfectionPercent;
    private double goodPercent;
    private double averagePercent;
    private double timepassPercent;
    private double skipPercent;
    private String consensusRating;
    private double ratingScore; // 0.0 to 10.0

    public ReviewDistributionDto() {}

    public Long getFilmId() { return filmId; }
    public void setFilmId(Long filmId) { this.filmId = filmId; }

    public long getTotalReviews() { return totalReviews; }
    public void setTotalReviews(long totalReviews) { this.totalReviews = totalReviews; }

    public long getPerfectionCount() { return perfectionCount; }
    public void setPerfectionCount(long perfectionCount) { this.perfectionCount = perfectionCount; }

    public long getGoodCount() { return goodCount; }
    public void setGoodCount(long goodCount) { this.goodCount = goodCount; }

    public long getAverageCount() { return averageCount; }
    public void setAverageCount(long averageCount) { this.averageCount = averageCount; }

    public long getTimepassCount() { return timepassCount; }
    public void setTimepassCount(long timepassCount) { this.timepassCount = timepassCount; }

    public long getSkipCount() { return skipCount; }
    public void setSkipCount(long skipCount) { this.skipCount = skipCount; }

    public double getPerfectionPercent() { return perfectionPercent; }
    public void setPerfectionPercent(double perfectionPercent) { this.perfectionPercent = perfectionPercent; }

    public double getGoodPercent() { return goodPercent; }
    public void setGoodPercent(double goodPercent) { this.goodPercent = goodPercent; }

    public double getAveragePercent() { return averagePercent; }
    public void setAveragePercent(double averagePercent) { this.averagePercent = averagePercent; }

    public double getTimepassPercent() { return timepassPercent; }
    public void setTimepassPercent(double timepassPercent) { this.timepassPercent = timepassPercent; }

    public double getSkipPercent() { return skipPercent; }
    public void setSkipPercent(double skipPercent) { this.skipPercent = skipPercent; }

    public String getConsensusRating() { return consensusRating; }
    public void setConsensusRating(String consensusRating) { this.consensusRating = consensusRating; }

    public double getRatingScore() { return ratingScore; }
    public void setRatingScore(double ratingScore) { this.ratingScore = ratingScore; }
}


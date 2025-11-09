package com.ecommerce.backend.dto;

public class ProductRatingResponse {
    private Double averageRating;
    private Long totalRatings;

    public ProductRatingResponse(Double averageRating, Long totalRatings) {
        this.averageRating = averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0;
        this.totalRatings = totalRatings != null ? totalRatings : 0L;
    }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Long getTotalRatings() { return totalRatings; }
    public void setTotalRatings(Long totalRatings) { this.totalRatings = totalRatings; }
}
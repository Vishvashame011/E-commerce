package com.ecommerce.backend.dto;

public class PromoCodeValidationResponse {
    private boolean valid;
    private String message;
    private Double discountPercentage;

    public PromoCodeValidationResponse(boolean valid, String message, Double discountPercentage) {
        this.valid = valid;
        this.message = message;
        this.discountPercentage = discountPercentage;
    }

    // Getters and Setters
    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(Double discountPercentage) { this.discountPercentage = discountPercentage; }
}
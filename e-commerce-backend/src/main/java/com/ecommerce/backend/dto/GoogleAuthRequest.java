package com.ecommerce.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleAuthRequest {
    @NotBlank(message = "Google token is required")
    private String token;

    private String mobileNumber; // Required for new users

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }
}
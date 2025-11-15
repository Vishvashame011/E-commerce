package com.ecommerce.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class OtpRequest {
    @NotBlank(message = "Identifier is required")
    private String identifier; // email or mobile

    @NotBlank(message = "OTP is required")
    private String otp;

    @NotBlank(message = "Type is required")
    private String type; // SIGNUP, LOGIN, EMAIL_VERIFICATION

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
package com.ecommerce.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp, String type) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        
        String subject = getSubjectByType(type);
        String body = getBodyByType(type, otp);
        
        message.setSubject(subject);
        message.setText(body);
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    private String getSubjectByType(String type) {
        switch (type) {
            case "SIGNUP":
                return "Verify Your Account - OTP";
            case "LOGIN":
                return "Login Verification - OTP";
            case "EMAIL_VERIFICATION":
                return "Email Verification - OTP";
            default:
                return "Verification Code";
        }
    }

    private String getBodyByType(String type, String otp) {
        String baseMessage = "Your verification code is: " + otp + "\n\n";
        baseMessage += "This code will expire in 5 minutes.\n";
        baseMessage += "If you didn't request this code, please ignore this email.\n\n";
        baseMessage += "Best regards,\nE-Commerce Team";
        
        return baseMessage;
    }
}
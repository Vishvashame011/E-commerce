package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.OtpVerification;
import com.ecommerce.backend.repository.OtpVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OtpService {

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Autowired
    private EmailService emailService;

    @Value("${app.otp.expirationMs:300000}")
    private long otpExpirationMs;

    @Value("${app.otp.length:6}")
    private int otpLength;

    private final SecureRandom random = new SecureRandom();

    public String generateOtp() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    @Transactional
    public void sendOtp(String identifier, String type) {
        otpRepository.deleteByIdentifierAndType(identifier, type);

        String otp = generateOtp();
        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(otpExpirationMs / 1000);

        OtpVerification otpVerification = new OtpVerification(identifier, otp, type, expiresAt);
        otpRepository.save(otpVerification);

        if (identifier.contains("@")) {
            // Email - send via email service
            emailService.sendOtpEmail(identifier, otp, type);
            System.out.println("Email OTP sent to: " + identifier + " | OTP: " + otp);
        } else {
            // Mobile - show in console for now
            System.out.println("=== MOBILE OTP ===");
            System.out.println("Phone: " + identifier);
            System.out.println("OTP: " + otp);
            System.out.println("Type: " + type);
            System.out.println("==================");
        }
    }

    public boolean verifyOtp(String identifier, String otp, String type) {
        Optional<OtpVerification> otpVerificationOpt = otpRepository
                .findByIdentifierAndOtpAndTypeAndVerifiedFalse(identifier, otp, type);

        if (otpVerificationOpt.isEmpty()) {
            return false;
        }

        OtpVerification otpVerification = otpVerificationOpt.get();
        
        if (otpVerification.getExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }

        otpVerification.setVerified(true);
        otpRepository.save(otpVerification);
        return true;
    }

    @Transactional
    public void cleanupExpiredOtps() {
        otpRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}
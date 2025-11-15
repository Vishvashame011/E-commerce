package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findByIdentifierAndOtpAndTypeAndVerifiedFalse(String identifier, String otp, String type);
    void deleteByIdentifierAndType(String identifier, String type);
    void deleteByExpiresAtBefore(LocalDateTime dateTime);
}
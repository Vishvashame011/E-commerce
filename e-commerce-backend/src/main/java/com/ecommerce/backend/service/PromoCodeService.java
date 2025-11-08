package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.PromoCodeValidationResponse;
import com.ecommerce.backend.entity.PromoCode;
import com.ecommerce.backend.repository.PromoCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PromoCodeService {

    @Autowired
    private PromoCodeRepository promoCodeRepository;

    public PromoCodeValidationResponse validatePromoCode(String code) {
        Optional<PromoCode> promoCodeOpt = promoCodeRepository.findByCodeAndIsActiveTrue(code);
        
        if (promoCodeOpt.isEmpty()) {
            return new PromoCodeValidationResponse(false, "Invalid promo code", 0.0);
        }

        PromoCode promoCode = promoCodeOpt.get();
        LocalDateTime now = LocalDateTime.now();

        if (promoCode.getValidFrom() != null && now.isBefore(promoCode.getValidFrom())) {
            return new PromoCodeValidationResponse(false, "Promo code is not yet valid", 0.0);
        }

        if (promoCode.getValidUntil() != null && now.isAfter(promoCode.getValidUntil())) {
            return new PromoCodeValidationResponse(false, "Promo code has expired", 0.0);
        }

        return new PromoCodeValidationResponse(true, "Promo code is valid", promoCode.getDiscountPercentage());
    }

    public PromoCode savePromoCode(PromoCode promoCode) {
        return promoCodeRepository.save(promoCode);
    }
}
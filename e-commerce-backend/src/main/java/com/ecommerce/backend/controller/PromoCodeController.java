package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.PromoCodeValidationResponse;
import com.ecommerce.backend.service.PromoCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/promo-codes")
@CrossOrigin(origins = "http://localhost:3000")
public class PromoCodeController {

    @Autowired
    private PromoCodeService promoCodeService;

    @GetMapping("/validate/{code}")
    public ResponseEntity<PromoCodeValidationResponse> validatePromoCode(@PathVariable String code) {
        PromoCodeValidationResponse response = promoCodeService.validatePromoCode(code);
        return ResponseEntity.ok(response);
    }
}
package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Wishlist;
import com.ecommerce.backend.service.WishlistService;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class WishlistController {

    private static final Logger logger = LoggerFactory.getLogger(WishlistController.class);

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<?> getUserWishlist(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
        }

        try {
            List<Wishlist> wishlist = wishlistService.getUserWishlist(authentication.getName());
            // Ensure product data is loaded
            wishlist.forEach(item -> {
                if (item.getProduct() != null) {
                    item.getProduct().getId(); // Force lazy loading
                }
            });
            return ResponseEntity.ok(wishlist);
        } catch (RuntimeException e) {
            logger.error("Error fetching wishlist: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<?> checkWishlistStatus(@PathVariable Long productId, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(Map.of("inWishlist", false));
        }

        try {
            boolean inWishlist = wishlistService.isInWishlist(authentication.getName(), productId);
            return ResponseEntity.ok(Map.of("inWishlist", inWishlist));
        } catch (Exception e) {
            logger.error("Error checking wishlist status: {}", e.getMessage());
            return ResponseEntity.ok(Map.of("inWishlist", false));
        }
    }

    @PostMapping("/toggle/{productId}")
    public ResponseEntity<?> toggleWishlist(@PathVariable Long productId, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
        }

        try {
            boolean added = wishlistService.toggleWishlist(authentication.getName(), productId);
            Map<String, Object> response = new HashMap<>();
            response.put("inWishlist", added);
            response.put("message", added ? "Added to wishlist" : "Removed from wishlist");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error toggling wishlist: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
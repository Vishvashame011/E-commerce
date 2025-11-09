package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.service.CartService;
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
@RequestMapping("/api/cart")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class CartController {

    private static final Logger logger = LoggerFactory.getLogger(CartController.class);

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<?> getUserCart(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
        }

        try {
            List<Cart> cart = cartService.getUserCart(authentication.getName());
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            logger.error("Error fetching cart: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") Integer quantity,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
        }

        try {
            Cart cart = cartService.addToCart(authentication.getName(), productId, quantity);
            Long itemCount = cartService.getCartItemCount(authentication.getName());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product added to cart");
            response.put("cartItemCount", itemCount);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error adding to cart: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCartItem(
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
        }

        try {
            cartService.updateCartItemQuantity(authentication.getName(), productId, quantity);
            Long itemCount = cartService.getCartItemCount(authentication.getName());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Cart updated");
            response.put("cartItemCount", itemCount);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error updating cart: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long productId, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
        }

        try {
            cartService.removeFromCart(authentication.getName(), productId);
            Long itemCount = cartService.getCartItemCount(authentication.getName());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product removed from cart");
            response.put("cartItemCount", itemCount);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error removing from cart: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Authentication required"));
        }

        try {
            cartService.clearCart(authentication.getName());
            return ResponseEntity.ok(Map.of("message", "Cart cleared", "cartItemCount", 0));
        } catch (RuntimeException e) {
            logger.error("Error clearing cart: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> getCartItemCount(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(Map.of("cartItemCount", 0));
        }

        try {
            Long itemCount = cartService.getCartItemCount(authentication.getName());
            return ResponseEntity.ok(Map.of("cartItemCount", itemCount));
        } catch (Exception e) {
            logger.error("Error getting cart count: {}", e.getMessage());
            return ResponseEntity.ok(Map.of("cartItemCount", 0));
        }
    }
}
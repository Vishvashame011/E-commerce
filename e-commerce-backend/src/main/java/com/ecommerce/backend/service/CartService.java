package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.CartRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private static final Logger logger = LoggerFactory.getLogger(CartService.class);

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<Cart> getUserCart(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        return cartRepository.findByUserOrderByAddedAtDesc(userOpt.get());
    }

    @Transactional
    public Cart addToCart(String username, Long productId, Integer quantity) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<Product> productOpt = productRepository.findById(productId);
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found");
        }

        User user = userOpt.get();
        Product product = productOpt.get();

        Optional<Cart> existingCart = cartRepository.findByUserAndProduct(user, product);
        
        Cart cart;
        if (existingCart.isPresent()) {
            // Update quantity
            cart = existingCart.get();
            cart.setQuantity(cart.getQuantity() + quantity);
            logger.info("Updated cart item for user {} product {} new quantity {}", username, productId, cart.getQuantity());
        } else {
            // Add new item
            cart = new Cart();
            cart.setUser(user);
            cart.setProduct(product);
            cart.setQuantity(quantity);
            logger.info("Added new cart item for user {} product {} quantity {}", username, productId, quantity);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public void updateCartItemQuantity(String username, Long productId, Integer quantity) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<Product> productOpt = productRepository.findById(productId);
        
        if (userOpt.isEmpty() || productOpt.isEmpty()) {
            throw new RuntimeException("User or Product not found");
        }

        Optional<Cart> cartOpt = cartRepository.findByUserAndProduct(userOpt.get(), productOpt.get());
        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            if (quantity <= 0) {
                cartRepository.delete(cart);
                logger.info("Removed cart item for user {} product {}", username, productId);
            } else {
                cart.setQuantity(quantity);
                cartRepository.save(cart);
                logger.info("Updated cart item quantity for user {} product {} to {}", username, productId, quantity);
            }
        }
    }

    @Transactional
    public void removeFromCart(String username, Long productId) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<Product> productOpt = productRepository.findById(productId);
        
        if (userOpt.isPresent() && productOpt.isPresent()) {
            cartRepository.deleteByUserAndProduct(userOpt.get(), productOpt.get());
            logger.info("Removed product {} from cart for user {}", productId, username);
        }
    }

    @Transactional
    public void clearCart(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            cartRepository.deleteByUser(userOpt.get());
            logger.info("Cleared cart for user {}", username);
        }
    }

    public Long getCartItemCount(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            return cartRepository.getCartItemCount(userOpt.get());
        }
        return 0L;
    }
}
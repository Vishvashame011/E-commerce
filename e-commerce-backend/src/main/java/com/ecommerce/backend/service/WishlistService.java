package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.Wishlist;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.repository.WishlistRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {

    private static final Logger logger = LoggerFactory.getLogger(WishlistService.class);

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<Wishlist> getUserWishlist(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        List<Wishlist> wishlist = wishlistRepository.findByUserOrderByAddedAtDesc(userOpt.get());
        // Force loading of product data
        wishlist.forEach(item -> {
            if (item.getProduct() != null) {
                item.getProduct().getTitle(); // Force lazy loading
            }
        });
        return wishlist;
    }

    public boolean isInWishlist(String username, Long productId) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<Product> productOpt = productRepository.findById(productId);
        
        if (userOpt.isEmpty() || productOpt.isEmpty()) {
            return false;
        }
        
        return wishlistRepository.existsByUserAndProduct(userOpt.get(), productOpt.get());
    }

    @Transactional
    public boolean toggleWishlist(String username, Long productId) {
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

        Optional<Wishlist> existingWishlist = wishlistRepository.findByUserAndProduct(user, product);
        
        if (existingWishlist.isPresent()) {
            // Remove from wishlist
            wishlistRepository.delete(existingWishlist.get());
            logger.info("Removed product {} from wishlist for user {}", productId, username);
            return false;
        } else {
            // Add to wishlist
            Wishlist wishlist = new Wishlist();
            wishlist.setUser(user);
            wishlist.setProduct(product);
            wishlistRepository.save(wishlist);
            logger.info("Added product {} to wishlist for user {}", productId, username);
            return true;
        }
    }
}
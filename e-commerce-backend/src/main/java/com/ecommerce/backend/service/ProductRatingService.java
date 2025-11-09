package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductRatingResponse;
import com.ecommerce.backend.dto.RatingRequest;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ProductRating;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.ProductRatingRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class ProductRatingService {

    private static final Logger logger = LoggerFactory.getLogger(ProductRatingService.class);

    @Autowired
    private ProductRatingRepository productRatingRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public ProductRatingResponse getProductRating(Long productId) {
        Double avgRating = productRatingRepository.getAverageRatingByProductId(productId);
        Long totalRatings = productRatingRepository.getRatingCountByProductId(productId);
        return new ProductRatingResponse(avgRating, totalRatings);
    }

    @Transactional
    public ProductRating addOrUpdateRating(Long productId, String username, RatingRequest ratingRequest) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found");
        }

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        Product product = productOpt.get();
        User user = userOpt.get();

        // Check if user already rated this product
        Optional<ProductRating> existingRating = productRatingRepository.findByProductAndUser(product, user);
        
        ProductRating rating;
        if (existingRating.isPresent()) {
            // Update existing rating
            rating = existingRating.get();
            rating.setRating(ratingRequest.getRating());
            rating.setReview(ratingRequest.getReview());
            logger.info("Updated rating for product {} by user {}", productId, username);
        } else {
            // Create new rating
            rating = new ProductRating();
            rating.setProduct(product);
            rating.setUser(user);
            rating.setRating(ratingRequest.getRating());
            rating.setReview(ratingRequest.getReview());
            logger.info("Added new rating for product {} by user {}", productId, username);
        }

        return productRatingRepository.save(rating);
    }
}
package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.ProductRating;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProductRatingRepository extends JpaRepository<ProductRating, Long> {
    
    @Query("SELECT AVG(pr.rating) FROM ProductRating pr WHERE pr.product.id = :productId")
    Double getAverageRatingByProductId(@Param("productId") Long productId);
    
    @Query("SELECT COUNT(pr) FROM ProductRating pr WHERE pr.product.id = :productId")
    Long getRatingCountByProductId(@Param("productId") Long productId);
    
    Optional<ProductRating> findByProductAndUser(Product product, User user);
    
    boolean existsByProductAndUser(Product product, User user);
}
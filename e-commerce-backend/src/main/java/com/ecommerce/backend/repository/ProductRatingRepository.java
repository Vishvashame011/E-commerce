package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.ProductRating;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    
    @Query("SELECT pr FROM ProductRating pr JOIN FETCH pr.user WHERE pr.product.id = :productId ORDER BY pr.rating DESC, pr.createdAt DESC")
    Page<ProductRating> findByProductIdOrderByCreatedAtDesc(@Param("productId") Long productId, Pageable pageable);
    
    @Query("SELECT pr.rating, COUNT(pr) FROM ProductRating pr WHERE pr.product.id = :productId GROUP BY pr.rating ORDER BY pr.rating DESC")
    Object[][] getRatingDistributionByProductId(@Param("productId") Long productId);
}
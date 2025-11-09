package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Cart;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserOrderByAddedAtDesc(User user);
    Optional<Cart> findByUserAndProduct(User user, Product product);
    void deleteByUserAndProduct(User user, Product product);
    void deleteByUser(User user);
    
    @Query("SELECT COUNT(c) FROM Cart c WHERE c.user = :user")
    Long getCartItemCount(@Param("user") User user);
}
package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Wishlist;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserOrderByAddedAtDesc(User user);
    Optional<Wishlist> findByUserAndProduct(User user, Product product);
    boolean existsByUserAndProduct(User user, Product product);
    void deleteByUserAndProduct(User user, Product product);
}
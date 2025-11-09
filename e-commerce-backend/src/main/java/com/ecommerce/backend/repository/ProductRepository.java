package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByCategoryIgnoreCase(String category);
    Page<Product> findByCategoryIgnoreCase(String category, Pageable pageable);
    List<Product> findByCategoryIgnoreCaseAndIdNot(String category, Long id);
}
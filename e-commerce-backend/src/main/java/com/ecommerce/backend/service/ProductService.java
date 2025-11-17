package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;

    public Page<Product> getAllProducts(Pageable pageable) {
        logger.info("Fetching products with pagination: page {}, size {}", pageable.getPageNumber(), pageable.getPageSize());
        return productRepository.findAll(pageable);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    public Page<Product> getProductsByCategory(String category, Pageable pageable) {
        logger.info("Fetching products for category {} with pagination: page {}, size {}", 
                   category, pageable.getPageNumber(), pageable.getPageSize());
        return productRepository.findByCategoryIgnoreCase(category, pageable);
    }

    public List<String> getAllCategories() {
        logger.info("Fetching all unique categories");
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(Product::getCategory)
                .distinct()
                .sorted()
                .collect(java.util.stream.Collectors.toList());
    }

    public List<Product> getRelatedProducts(String category, Long excludeId, int limit) {
        List<Product> products = productRepository.findByCategoryIgnoreCaseAndIdNot(category, excludeId);
        java.util.Collections.shuffle(products); // Randomize the order
        return products.stream().limit(limit).collect(java.util.stream.Collectors.toList());
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public long getTotalProducts() {
        return productRepository.count();
    }

    public Product updateProduct(Long id, Product productDetails) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setTitle(productDetails.getTitle());
            product.setDescription(productDetails.getDescription());
            product.setPrice(productDetails.getPrice());
            product.setCategory(productDetails.getCategory());
            product.setImage(productDetails.getImage());
            product.setRatingRate(productDetails.getRatingRate());
            product.setRatingCount(productDetails.getRatingCount());
            return productRepository.save(product);
        }
        throw new RuntimeException("Product not found");
    }
}
package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.service.ProductService;
import com.ecommerce.backend.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<?> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Product> products = productService.getAllProducts(pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("products", products.getContent());
            response.put("currentPage", products.getNumber());
            response.put("totalItems", products.getTotalElements());
            response.put("totalPages", products.getTotalPages());
            
            logger.info("Retrieved {} products for page {}", products.getContent().size(), page);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error retrieving products: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to retrieve products"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        try {
            List<String> categories = productService.getAllCategories();
            logger.info("Retrieved {} categories", categories.size());
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            logger.error("Error retrieving categories: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to retrieve categories"));
        }
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<List<Product>> getRelatedProducts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "4") int limit) {
        Optional<Product> product = productService.getProductById(id);
        if (product.isPresent()) {
            List<Product> relatedProducts = productService.getRelatedProducts(
                product.get().getCategory(), id, limit);
            return ResponseEntity.ok(relatedProducts);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> createProduct(
            @RequestParam("title") String title,
            @RequestParam("price") Double price,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("ratingRate") Double ratingRate,
            @RequestParam("ratingCount") Integer ratingCount,
            @RequestParam("image") MultipartFile image) {
        
        try {
            logger.info("Creating product: {}", title);
            
            // Validate image file
            if (image == null || image.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Image file is required"));
            }
            
            if (!fileStorageService.isValidImageFile(image)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid image file. Only image files are allowed."));
            }

            // Store image file
            String filename = fileStorageService.storeFile(image);
            String imageUrl = "/uploads/" + filename;
            logger.info("Image stored: {}", imageUrl);

            // Create product
            Product product = new Product();
            product.setTitle(title);
            product.setPrice(price);
            product.setDescription(description);
            product.setCategory(category);
            product.setImage(imageUrl);
            product.setRatingRate(ratingRate);
            product.setRatingCount(ratingCount);

            Product savedProduct = productService.saveProduct(product);
            logger.info("Product saved with ID: {}", savedProduct.getId());
            return ResponseEntity.ok(savedProduct);
        } catch (IOException e) {
            logger.error("IO Error creating product: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to upload image"));
        } catch (Exception e) {
            logger.error("Error creating product: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create product"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        Optional<Product> existingProduct = productService.getProductById(id);
        if (existingProduct.isPresent()) {
            product.setId(id);
            Product updatedProduct = productService.saveProduct(product);
            return ResponseEntity.ok(updatedProduct);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        if (product.isPresent()) {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
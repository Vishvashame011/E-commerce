package com.ecommerce.backend.config;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.PromoCode;
import com.ecommerce.backend.service.ProductService;
import com.ecommerce.backend.service.PromoCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private ProductService productService;

    @Autowired
    private PromoCodeService promoCodeService;

    @Override
    public void run(String... args) throws Exception {
        try {
            Thread.sleep(2000); // Wait for database to be ready
            // seedProducts(); // Disabled - products will be added manually
            seedPromoCodes(); // Keep promo codes for testing
            System.out.println("DataSeeder: Promo codes added. Products can be added via Add Product page.");
        } catch (Exception e) {
            System.err.println("Error during data seeding: " + e.getMessage());
        }
    }

    private void seedProducts() {
        try {
            if (productService.getAllProducts().isEmpty()) {
                // Create products with manual ID setting
                // Sample products with external images
                Product p1 = new Product();
                p1.setTitle("iPhone 14 Pro");
                p1.setPrice(999.99);
                p1.setDescription("Latest iPhone with advanced camera system and A16 Bionic chip");
                p1.setCategory("electronics");
                p1.setImage("https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg");
                p1.setRatingRate(4.5);
                p1.setRatingCount(120);
                productService.saveProduct(p1);

                Product p2 = new Product();
                p2.setTitle("Samsung Galaxy S23");
                p2.setPrice(899.99);
                p2.setDescription("Flagship Android smartphone with excellent display and camera");
                p2.setCategory("electronics");
                p2.setImage("https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg");
                p2.setRatingRate(4.3);
                p2.setRatingCount(95);
                productService.saveProduct(p2);

                Product p3 = new Product();
                p3.setTitle("Men's Casual Slim Fit T-Shirt");
                p3.setPrice(22.99);
                p3.setDescription("Comfortable cotton t-shirt perfect for everyday wear");
                p3.setCategory("men's clothing");
                p3.setImage("https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg");
                p3.setRatingRate(4.1);
                p3.setRatingCount(259);
                productService.saveProduct(p3);

                Product p4 = new Product();
                p4.setTitle("Men's Cotton Jacket");
                p4.setPrice(55.99);
                p4.setDescription("Stylish cotton jacket suitable for all seasons");
                p4.setCategory("men's clothing");
                p4.setImage("https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg");
                p4.setRatingRate(4.7);
                p4.setRatingCount(500);
                productService.saveProduct(p4);

                Product p5 = new Product();
                p5.setTitle("Women's Summer Dress");
                p5.setPrice(39.99);
                p5.setDescription("Elegant summer dress made from breathable fabric");
                p5.setCategory("women's clothing");
                p5.setImage("https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg");
                p5.setRatingRate(3.8);
                p5.setRatingCount(146);
                productService.saveProduct(p5);

                Product p6 = new Product();
                p6.setTitle("Women's Leather Jacket");
                p6.setPrice(89.99);
                p6.setDescription("Premium leather jacket with modern design");
                p6.setCategory("women's clothing");
                p6.setImage("https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg");
                p6.setRatingRate(4.2);
                p6.setRatingCount(203);
                productService.saveProduct(p6);

                Product p7 = new Product();
                p7.setTitle("Gold Plated Necklace");
                p7.setPrice(168.99);
                p7.setDescription("Beautiful gold plated necklace with elegant design");
                p7.setCategory("jewelery");
                p7.setImage("https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg");
                p7.setRatingRate(3.9);
                p7.setRatingCount(70);
                productService.saveProduct(p7);

                Product p8 = new Product();
                p8.setTitle("Silver Ring Set");
                p8.setPrice(45.99);
                p8.setDescription("Set of 3 silver rings with different designs");
                p8.setCategory("jewelery");
                p8.setImage("https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg");
                p8.setRatingRate(4.0);
                p8.setRatingCount(400);
                productService.saveProduct(p8);
            }
        } catch (Exception e) {
            System.err.println("Error seeding products: " + e.getMessage());
        }
    }

    private void seedPromoCodes() {
        try {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime futureDate = now.plusMonths(6);

            // Check if promo codes already exist
            if (!promoCodeExists("SAVE10")) {
                PromoCode pc1 = new PromoCode();
                pc1.setCode("SAVE10");
                pc1.setDiscountPercentage(10.0);
                pc1.setValidFrom(now);
                pc1.setValidUntil(futureDate);
                pc1.setIsActive(true);
                promoCodeService.savePromoCode(pc1);
            }

            if (!promoCodeExists("SAVE20")) {
                PromoCode pc2 = new PromoCode();
                pc2.setCode("SAVE20");
                pc2.setDiscountPercentage(20.0);
                pc2.setValidFrom(now);
                pc2.setValidUntil(futureDate);
                pc2.setIsActive(true);
                promoCodeService.savePromoCode(pc2);
            }

            if (!promoCodeExists("WELCOME15")) {
                PromoCode pc3 = new PromoCode();
                pc3.setCode("WELCOME15");
                pc3.setDiscountPercentage(15.0);
                pc3.setValidFrom(now);
                pc3.setValidUntil(futureDate);
                pc3.setIsActive(true);
                promoCodeService.savePromoCode(pc3);
            }
            
            System.out.println("Promo codes seeding completed successfully");
        } catch (Exception e) {
            System.err.println("Error seeding promo codes: " + e.getMessage());
        }
    }

    private boolean promoCodeExists(String code) {
        try {
            return promoCodeService.validatePromoCode(code).isValid();
        } catch (Exception e) {
            return false;
        }
    }
}
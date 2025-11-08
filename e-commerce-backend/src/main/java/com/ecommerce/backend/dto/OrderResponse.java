package com.ecommerce.backend.dto;

import com.ecommerce.backend.entity.Order;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class OrderResponse {
    private Long id;
    private Double totalAmount;
    private Double discountAmount;
    private String promoCode;
    private String status;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime orderDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime deliveryDate;
    private String fullName;
    private String email;
    private String phone;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private List<OrderItemResponse> orderItems;

    public OrderResponse(Order order) {
        this.id = order.getId();
        this.totalAmount = order.getTotalAmount();
        this.discountAmount = order.getDiscountAmount();
        this.promoCode = order.getPromoCode();
        this.status = order.getStatus().toString();
        this.orderDate = order.getOrderDate();
        this.deliveryDate = order.getDeliveryDate();
        this.fullName = order.getFullName();
        this.email = order.getEmail();
        this.phone = order.getPhone();
        this.street = order.getStreet();
        this.city = order.getCity();
        this.state = order.getState();
        this.zipCode = order.getZipCode();
        this.country = order.getCountry();
        
        if (order.getOrderItems() != null) {
            this.orderItems = order.getOrderItems().stream()
                .map(OrderItemResponse::new)
                .collect(Collectors.toList());
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Double discountAmount) { this.discountAmount = discountAmount; }

    public String getPromoCode() { return promoCode; }
    public void setPromoCode(String promoCode) { this.promoCode = promoCode; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public LocalDateTime getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDateTime deliveryDate) { this.deliveryDate = deliveryDate; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public List<OrderItemResponse> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItemResponse> orderItems) { this.orderItems = orderItems; }

    public static class OrderItemResponse {
        private Long id;
        private Integer quantity;
        private Double price;
        private String productTitle;
        private String productImage;

        public OrderItemResponse(com.ecommerce.backend.entity.OrderItem orderItem) {
            this.id = orderItem.getId();
            this.quantity = orderItem.getQuantity();
            this.price = orderItem.getPrice();
            if (orderItem.getProduct() != null) {
                this.productTitle = orderItem.getProduct().getTitle();
                this.productImage = orderItem.getProduct().getImage();
            }
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }

        public String getProductTitle() { return productTitle; }
        public void setProductTitle(String productTitle) { this.productTitle = productTitle; }

        public String getProductImage() { return productImage; }
        public void setProductImage(String productImage) { this.productImage = productImage; }
    }
}
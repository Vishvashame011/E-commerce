package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.dto.OrderResponse;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        try {
            List<Order> orders = orderService.getAllOrders();
            System.out.println("=== ORDER API CALLED ===");
            System.out.println("Found " + orders.size() + " orders in database");
            
            List<OrderResponse> orderResponses = orders.stream()
                .map(OrderResponse::new)
                .collect(java.util.stream.Collectors.toList());
            
            System.out.println("=== RETURNING " + orderResponses.size() + " ORDER RESPONSES ===");
            return ResponseEntity.ok(orderResponses);
        } catch (Exception e) {
            System.err.println("Error fetching orders: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Orders API is working! Time: " + System.currentTimeMillis());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
        Order createdOrder = orderService.createOrder(orderRequest);
        return ResponseEntity.ok(createdOrder);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        try {
            Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            Order updatedOrder = orderService.updateOrderStatus(id, orderStatus);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
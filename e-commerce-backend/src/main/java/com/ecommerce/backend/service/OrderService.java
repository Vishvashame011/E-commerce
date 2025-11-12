package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Order> getAllOrders() {
        try {
            List<Order> orders = orderRepository.findAllByOrderByOrderDateDesc();
            System.out.println("OrderService: Retrieved " + orders.size() + " orders from repository");
            return orders;
        } catch (Exception e) {
            System.err.println("OrderService error: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Order updateOrderStatus(Long orderId, Order.OrderStatus newStatus) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(newStatus);
            if (newStatus == Order.OrderStatus.DELIVERED) {
                order.setDeliveryDate(LocalDateTime.now());
            }
            return orderRepository.save(order);
        }
        throw new RuntimeException("Order not found with id: " + orderId);
    }

    @Transactional
    public Order createOrderForUser(OrderRequest orderRequest, String username) {
        // Find user by username
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found: " + username);
        }

        Order order = new Order();
        order.setUser(userOpt.get());
        order.setTotalAmount(orderRequest.getTotalAmount());
        order.setDiscountAmount(orderRequest.getDiscountAmount());
        order.setPromoCode(orderRequest.getPromoCode());
        
        // Set address fields
        order.setFullName(orderRequest.getFullName());
        order.setEmail(orderRequest.getEmail());
        order.setPhone(orderRequest.getPhone());
        order.setStreet(orderRequest.getStreet());
        order.setCity(orderRequest.getCity());
        order.setState(orderRequest.getState());
        order.setZipCode(orderRequest.getZipCode());
        order.setCountry(orderRequest.getCountry());

        // Save order first to get ID
        order = orderRepository.save(order);

        // Create order items
        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderRequest.OrderItemRequest itemRequest : orderRequest.getItems()) {
            Optional<Product> productOpt = productRepository.findById(itemRequest.getProductId());
            if (productOpt.isPresent()) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(productOpt.get());
                orderItem.setQuantity(itemRequest.getQuantity());
                orderItem.setPrice(itemRequest.getPrice());
                orderItems.add(orderItem);
            }
        }
        
        order.setOrderItems(orderItems);
        return orderRepository.save(order);
    }

    @Scheduled(fixedRate = 300000) // Run every 5 minutes
    public void updateOrderStatusToDelivered() {
        LocalDateTime sixHoursAgo = LocalDateTime.now().minusHours(6);
        List<Order> pendingOrders = orderRepository.findPendingOrdersOlderThan(sixHoursAgo);
        
        for (Order order : pendingOrders) {
            order.setStatus(Order.OrderStatus.DELIVERED);
            order.setDeliveryDate(LocalDateTime.now());
            orderRepository.save(order);
            System.out.println("Order #" + order.getId() + " status updated to DELIVERED");
        }
        
        if (!pendingOrders.isEmpty()) {
            System.out.println("Updated " + pendingOrders.size() + " orders to DELIVERED status");
        }
    }

    public List<Order> getOrdersByUsername(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found: " + username);
        }
        return orderRepository.findByUserOrderByOrderDateDesc(userOpt.get());
    }

    public void cancelOrder(Long orderId, String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found: " + username);
        }
        
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("Order not found");
        }
        
        Order order = orderOpt.get();
        if (!order.getUser().getId().equals(userOpt.get().getId())) {
            throw new RuntimeException("You can only cancel your own orders");
        }
        
        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new RuntimeException("Only pending orders can be cancelled");
        }
        
        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    @Transactional
    public Order createOrder(OrderRequest orderRequest) {
        // Find user
        Optional<User> userOpt = userRepository.findById(orderRequest.getUserId());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with id: " + orderRequest.getUserId());
        }

        Order order = new Order();
        order.setUser(userOpt.get());
        order.setTotalAmount(orderRequest.getTotalAmount());
        order.setDiscountAmount(orderRequest.getDiscountAmount());
        order.setPromoCode(orderRequest.getPromoCode());
        
        // Set address fields
        order.setFullName(orderRequest.getFullName());
        order.setEmail(orderRequest.getEmail());
        order.setPhone(orderRequest.getPhone());
        order.setStreet(orderRequest.getStreet());
        order.setCity(orderRequest.getCity());
        order.setState(orderRequest.getState());
        order.setZipCode(orderRequest.getZipCode());
        order.setCountry(orderRequest.getCountry());

        // Save order first to get ID
        order = orderRepository.save(order);

        // Create order items
        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderRequest.OrderItemRequest itemRequest : orderRequest.getItems()) {
            Optional<Product> productOpt = productRepository.findById(itemRequest.getProductId());
            if (productOpt.isPresent()) {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(productOpt.get());
                orderItem.setQuantity(itemRequest.getQuantity());
                orderItem.setPrice(itemRequest.getPrice());
                orderItems.add(orderItem);
            }
        }
        
        order.setOrderItems(orderItems);
        return orderRepository.save(order);
    }
}
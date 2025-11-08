package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
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

    public List<Order> getAllOrders() {
        return orderRepository.findByOrderByOrderDateDesc();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Transactional
    public Order createOrder(OrderRequest orderRequest) {
        Order order = new Order();
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
        }
    }
}
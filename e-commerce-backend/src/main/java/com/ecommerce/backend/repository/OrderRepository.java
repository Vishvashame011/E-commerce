package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByOrderByOrderDateDesc();
    List<Order> findByUserOrderByOrderDateDesc(User user);
    
    @Query("SELECT o FROM Order o WHERE o.status = 'PENDING' AND o.orderDate <= :cutoffTime")
    List<Order> findPendingOrdersOlderThan(LocalDateTime cutoffTime);
}
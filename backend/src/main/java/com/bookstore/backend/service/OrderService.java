package com.bookstore.backend.service;

import com.bookstore.backend.dto.OrderRequest;
import com.bookstore.backend.dto.OrderResponse;
import com.bookstore.backend.dto.OrderStatusRequest;
import com.bookstore.backend.dto.PaymentRequest;
import com.bookstore.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(Long userId, OrderRequest request);
    OrderResponse processPayment(Long userId, Long orderId, PaymentRequest request);
    List<OrderResponse> getOrdersForUser(Long userId);
    OrderResponse getOrderById(Long orderId, User requestingUser);
    Page<OrderResponse> getAllOrders(Pageable pageable);
    OrderResponse updateOrderStatus(Long orderId, OrderStatusRequest request);
}
package com.bookstore.backend.controller;

import com.bookstore.backend.dto.ApiResponse;
import com.bookstore.backend.dto.OrderRequest;
import com.bookstore.backend.dto.OrderResponse;
import com.bookstore.backend.dto.PaymentRequest;
import com.bookstore.backend.entity.User;
import com.bookstore.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody OrderRequest request) {
        OrderResponse response = orderService.createOrder(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(response));
    }

    @PostMapping("/{id}/payment")
    public ResponseEntity<ApiResponse<OrderResponse>> processPayment(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody PaymentRequest request) {
        OrderResponse response = orderService.processPayment(user.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.of(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMyOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.of(orderService.getOrdersForUser(user.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(orderService.getOrderById(id, user)));
    }
}
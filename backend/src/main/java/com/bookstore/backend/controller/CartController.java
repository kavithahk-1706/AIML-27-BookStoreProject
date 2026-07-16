package com.bookstore.backend.controller;

import com.bookstore.backend.dto.AddCartItemRequest;
import com.bookstore.backend.dto.ApiResponse;
import com.bookstore.backend.dto.CartResponse;
import com.bookstore.backend.dto.UpdateCartItemRequest;
import com.bookstore.backend.entity.User;
import com.bookstore.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.of(cartService.getCart(user.getId())));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddCartItemRequest request) {
        return ResponseEntity.ok(ApiResponse.of(cartService.addItem(user.getId(), request)));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(ApiResponse.of(cartService.updateItem(user.getId(), itemId, request)));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long itemId) {
        return ResponseEntity.ok(ApiResponse.of(cartService.removeItem(user.getId(), itemId)));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<CartResponse>> clearCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.of(cartService.clearCart(user.getId())));
    }
}
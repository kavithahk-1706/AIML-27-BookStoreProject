package com.bookstore.backend.service;

import com.bookstore.backend.dto.AddCartItemRequest;
import com.bookstore.backend.dto.CartResponse;
import com.bookstore.backend.dto.UpdateCartItemRequest;

public interface CartService {
    CartResponse getCart(Long userId);
    CartResponse addItem(Long userId, AddCartItemRequest request);
    CartResponse updateItem(Long userId, Long itemId, UpdateCartItemRequest request);
    CartResponse removeItem(Long userId, Long itemId);
    CartResponse clearCart(Long userId);
}
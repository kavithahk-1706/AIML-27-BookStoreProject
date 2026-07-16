package com.bookstore.backend.service.impl;

import com.bookstore.backend.dto.AddCartItemRequest;
import com.bookstore.backend.dto.CartResponse;
import com.bookstore.backend.dto.UpdateCartItemRequest;
import com.bookstore.backend.entity.Book;
import com.bookstore.backend.entity.CartItem;
import com.bookstore.backend.entity.User;
import com.bookstore.backend.exception.ResourceNotFoundException;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.CartItemRepository;
import com.bookstore.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;

    @Override
    public CartResponse getCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        return CartResponse.fromEntities(items);
    }

    @Override
    @Transactional
    public CartResponse addItem(Long userId, AddCartItemRequest request) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + request.getBookId()));

        // one row per (user, book) — if it already exists, increment instead of duplicating
        CartItem existing = cartItemRepository.findByUserIdAndBookId(userId, request.getBookId())
                .orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + request.getQuantity());
            cartItemRepository.save(existing);
        } else {
            CartItem newItem = CartItem.builder()
                    .user(User.builder().id(userId).build()) // reference-only, avoids an extra user fetch
                    .book(book)
                    .quantity(request.getQuantity())
                    .build();
            cartItemRepository.save(newItem);
        }

        return getCart(userId);
    }

    @Override
    @Transactional
    public CartResponse updateItem(Long userId, Long itemId, UpdateCartItemRequest request) {
        CartItem item = getOwnedCartItem(userId, itemId);
        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);
        return getCart(userId);
    }

    @Override
    @Transactional
    public CartResponse removeItem(Long userId, Long itemId) {
        CartItem item = getOwnedCartItem(userId, itemId);
        cartItemRepository.delete(item);
        return getCart(userId);
    }

    @Override
    @Transactional
    public CartResponse clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
        return getCart(userId);
    }

    // Fetches a cart item and verifies it belongs to the requesting user.
    // If it belongs to someone else, we throw the SAME "not found" exception
    // rather than a 403 — this avoids leaking whether that item id exists at all.
    private CartItem getOwnedCartItem(Long userId, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!item.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Cart item not found with id: " + itemId);
        }

        return item;
    }
}
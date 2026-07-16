package com.bookstore.backend.service.impl;

import com.bookstore.backend.dto.OrderRequest;
import com.bookstore.backend.dto.OrderResponse;
import com.bookstore.backend.dto.OrderStatusRequest;
import com.bookstore.backend.dto.PaymentRequest;
import com.bookstore.backend.entity.*;
import com.bookstore.backend.exception.EmptyCartException;
import com.bookstore.backend.exception.InsufficientStockException;
import com.bookstore.backend.exception.InvalidOrderStateException;
import com.bookstore.backend.exception.ResourceNotFoundException;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.CartItemRepository;
import com.bookstore.backend.repository.OrderRepository;
import com.bookstore.backend.service.OrderService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;

    // Test "failure" cards per contract section 4a — same pattern real
    // sandboxes (Stripe etc.) use for their own test cards.
    private static final Set<String> DECLINED_CARDS = Set.of("4000000000000002");
    private static final Set<String> PROCESSING_ERROR_CARDS = Set.of("4000000000000119");

    @Override
    @Transactional
    public OrderResponse createOrder(Long userId, OrderRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new EmptyCartException();
        }

        // Reserve stock for every item FIRST. If any single item doesn't have
        // enough stock, this throws and @Transactional rolls back every
        // decrement that already happened in this loop — no partial reservations.
        for (CartItem cartItem : cartItems) {
            if (cartItem.getBook().getFormat() != BookFormat.PHYSICAL) {
                continue; // digital items have nothing to reserve — see contract 4b
            }
            int rowsUpdated = bookRepository.decrementStock(
                    cartItem.getBook().getId(), cartItem.getQuantity());

            if (rowsUpdated == 0) {
                throw new InsufficientStockException(cartItem.getBook().getTitle());
            }
        }

        BigDecimal total = cartItems.stream()
                .map(item -> item.getBook().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .user(User.builder().id(userId).build())
                .totalAmount(total)
                .status(OrderStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .shippingAddress(request.getShippingAddress())
                .build();

        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .book(cartItem.getBook())
                    .quantity(cartItem.getQuantity())
                    .priceAtPurchase(cartItem.getBook().getPrice()) // snapshot NOW, before it can change later
                    .build();
            order.getItems().add(orderItem);
        }

        Order saved = orderRepository.save(order); // cascades to order_items
        cartItemRepository.deleteByUserId(userId);

        return OrderResponse.fromEntity(saved);
    }

    @Override
    @Transactional
    public OrderResponse processPayment(Long userId, Long orderId, PaymentRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        // same "pretend it doesn't exist" pattern as cart items — don't leak
        // whether an order id belonging to someone else is real.
        if (!order.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Order not found with id: " + orderId);
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new InvalidOrderStateException(
                    "Order is not in a payable state (current status: " + order.getStatus() + ")");
        }

        boolean success = isPaymentSuccessful(request.getCardNumber());

        if (success) {
            order.setPaymentStatus(PaymentStatus.PAID);
            order.setStatus(OrderStatus.CONFIRMED);
        } else {
            order.setPaymentStatus(PaymentStatus.FAILED);
            order.setStatus(OrderStatus.CANCELLED);

            // release the reserved stock back — same atomic pattern as the decrement.
            for (OrderItem item : order.getItems()) {
                if (item.getBook().getFormat() != BookFormat.PHYSICAL) {
                    continue; // nothing was reserved for digital items — see contract 4b
                }
                bookRepository.incrementStock(item.getBook().getId(), item.getQuantity());
            }
        }

        Order saved = orderRepository.save(order);
        return OrderResponse.fromEntity(saved);
    }

    private boolean isPaymentSuccessful(String cardNumber) {
        String digitsOnly = cardNumber.replaceAll("\\s", "");

        if (DECLINED_CARDS.contains(digitsOnly) || PROCESSING_ERROR_CARDS.contains(digitsOnly)) {
            return false;
        }

        return isValidLuhn(digitsOnly);
    }

    // Standard Luhn algorithm check — same basic validation real card forms do
    // client-side before ever hitting a real processor.
    private boolean isValidLuhn(String cardNumber) {
        if (cardNumber.isEmpty() || !cardNumber.chars().allMatch(Character::isDigit)) {
            return false;
        }

        int sum = 0;
        boolean alternate = false;

        for (int i = cardNumber.length() - 1; i >= 0; i--) {
            int digit = Character.getNumericValue(cardNumber.charAt(i));

            if (alternate) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            alternate = !alternate;
        }

        return sum % 10 == 0;
    }
    
    @Transactional(readOnly=true)
    @Override
    public List<OrderResponse> getOrdersForUser(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(OrderResponse::fromEntity)
                .toList();
    }
    
    @Transactional(readOnly=true)
    @Override
    public OrderResponse getOrderById(Long orderId, User requestingUser) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        boolean isOwner = order.getUser().getId().equals(requestingUser.getId());
        boolean isAdmin = requestingUser.getRole() == Role.ADMIN;

        // Same "pretend it doesn't exist" pattern as everywhere else — but ADMIN
        // gets a real bypass here since the contract explicitly allows ADMIN to
        // view any order, not just their own.
        if (!isOwner && !isAdmin) {
            throw new ResourceNotFoundException("Order not found with id: " + orderId);
        }

        return OrderResponse.fromEntity(order);
    }
    
    
    @Transactional(readOnly=true)
    @Override
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(OrderResponse::fromEntity);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        order.setStatus(request.getStatus());
        Order saved = orderRepository.save(order);
        return OrderResponse.fromEntity(saved);
    }
}


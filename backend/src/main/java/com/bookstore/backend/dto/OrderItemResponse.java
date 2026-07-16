package com.bookstore.backend.dto;

import java.math.BigDecimal;

import com.bookstore.backend.entity.OrderItem;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private BookSummary book;
    private Integer quantity;
    private BigDecimal priceAtPurchase;
    private BigDecimal subtotal;

    public static OrderItemResponse fromEntity(OrderItem item) {
        BigDecimal subtotal = item.getPriceAtPurchase().multiply(BigDecimal.valueOf(item.getQuantity()));
        BookSummary book = new BookSummary(
                item.getBook().getId(),
                item.getBook().getTitle(),
                item.getBook().getAuthor(),
                item.getBook().getImageUrl(),
                item.getBook().getPrice()
        );
        return new OrderItemResponse(item.getId(), book, item.getQuantity(), item.getPriceAtPurchase(), subtotal);
    }
}
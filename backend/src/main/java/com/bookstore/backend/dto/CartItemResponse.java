package com.bookstore.backend.dto;

import com.bookstore.backend.entity.CartItem;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class CartItemResponse {

    private Long id;
    private BookSummary book;
    private Integer quantity;
    private BigDecimal subtotal;

    public static CartItemResponse fromEntity(CartItem item) {
        BigDecimal subtotal = item.getBook().getPrice()
                .multiply(BigDecimal.valueOf(item.getQuantity()));

        BookSummary book = new BookSummary(
                item.getBook().getId(),
                item.getBook().getTitle(),
                item.getBook().getAuthor(),
                item.getBook().getFormat(),
                item.getBook().getImageUrl(),
                item.getBook().getPrice(),
                item.getBook().getStockQuantity()
        );

        return new CartItemResponse(item.getId(), book, item.getQuantity(), subtotal);
    }
}
package com.bookstore.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class BookSummary {
    private Long id;
    private String title;
    private String imageUrl;
    private BigDecimal price;
}
package com.bookstore.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.math.BigDecimal;

import com.bookstore.backend.entity.BookFormat;

@Getter
@AllArgsConstructor
public class BookSummary {
    private Long id;
    private String title;
    private String author;
    private BookFormat format;
    private String imageUrl;
    private BigDecimal price;
   
}
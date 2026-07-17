package com.bookstore.backend.dto;

import com.bookstore.backend.entity.Book;
import com.bookstore.backend.entity.BookFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AdminBookResponse {

    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private Long categoryId;
    private String categoryName;
    private String imageUrl;
    private BookFormat format;
    private String fileUrl; // the one field BookResponse deliberately omits
    private LocalDateTime createdAt;

    public static AdminBookResponse fromEntity(Book book) {
        return new AdminBookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getIsbn(),
                book.getDescription(),
                book.getPrice(),
                book.getStockQuantity(),
                book.getCategory() != null ? book.getCategory().getId() : null,
                book.getCategory() != null ? book.getCategory().getName() : null,
                book.getImageUrl(),
                book.getFormat(),
                book.getFileUrl(),
                book.getCreatedAt()
        );
    }
}
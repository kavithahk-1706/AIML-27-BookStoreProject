package com.bookstore.backend.dto;

import com.bookstore.backend.entity.Book;
import com.bookstore.backend.entity.BookFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class BookResponse {

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
    // fileUrl is intentionally excluded — it's a server-side path,
    // never sent to the client. Download goes through the /download endpoint.
    private LocalDateTime createdAt;

    public static BookResponse fromEntity(Book book) {
        return new BookResponse(
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
                book.getCreatedAt()
        );
    }
}
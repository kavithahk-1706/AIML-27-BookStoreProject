package com.bookstore.backend.service;

import com.bookstore.backend.dto.BookRequest;
import com.bookstore.backend.dto.BookResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookService {
    Page<BookResponse> searchBooks(String search, Long categoryId, Pageable pageable);
    BookResponse getBookById(Long id);
    BookResponse createBook(BookRequest request);
    BookResponse updateBook(Long id, BookRequest request);
    void deleteBook(Long id);
}
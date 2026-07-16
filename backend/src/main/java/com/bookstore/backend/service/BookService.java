package com.bookstore.backend.service;

import com.bookstore.backend.dto.BookRequest;
import com.bookstore.backend.dto.BookResponse;
import com.bookstore.backend.dto.PurchaseStatusResponse;
import com.bookstore.backend.entity.BookFormat;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookService {
	Page<BookResponse> searchBooks(String search, Long categoryId, BookFormat format, Pageable pageable);;
    BookResponse getBookById(Long id);
    BookResponse createBook(BookRequest request);
    BookResponse updateBook(Long id, BookRequest request);
    void deleteBook(Long id);
    org.springframework.core.io.Resource downloadBook(Long bookId, Long userId);
    PurchaseStatusResponse getPurchaseStatus(Long bookId, Long userId);
}
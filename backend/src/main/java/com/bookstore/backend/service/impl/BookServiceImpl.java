package com.bookstore.backend.service.impl;

import com.bookstore.backend.dto.BookRequest;
import com.bookstore.backend.dto.BookResponse;
import com.bookstore.backend.entity.Book;
import com.bookstore.backend.entity.Category;
import com.bookstore.backend.exception.ResourceNotFoundException;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.CategoryRepository;
import com.bookstore.backend.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Page<BookResponse> searchBooks(String search, Long categoryId, Pageable pageable) {
        return bookRepository.search(search, categoryId, pageable)
                .map(BookResponse::fromEntity);
    }

    @Override
    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return BookResponse.fromEntity(book);
    }

    @Override
    public BookResponse createBook(BookRequest request) {
        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .isbn(request.getIsbn())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .format(request.getFormat())
                .fileUrl(request.getFileUrl())
                .category(resolveCategory(request.getCategoryId()))
                .build();
        return BookResponse.fromEntity(bookRepository.save(book));
    }

    @Override
    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setDescription(request.getDescription());
        book.setPrice(request.getPrice());
        book.setStockQuantity(request.getStockQuantity());
        book.setImageUrl(request.getImageUrl());
        book.setFormat(request.getFormat());
        book.setFileUrl(request.getFileUrl());
        book.setCategory(resolveCategory(request.getCategoryId()));

        return BookResponse.fromEntity(bookRepository.save(book));
    }

    @Override
    public void deleteBook(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new ResourceNotFoundException("Book not found with id: " + id);
        }
        bookRepository.deleteById(id);
    }

    private Category resolveCategory(Long categoryId) {
        if (categoryId == null) return null;
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
    }
}
package com.bookstore.backend.service.impl;

import com.bookstore.backend.dto.BookRequest;
import com.bookstore.backend.dto.BookResponse;
import com.bookstore.backend.dto.PurchaseStatusResponse;
import com.bookstore.backend.entity.Book;
import com.bookstore.backend.entity.BookFormat;
import com.bookstore.backend.entity.Category;
import com.bookstore.backend.exception.BookNotDigitalException;
import com.bookstore.backend.exception.BookNotPurchasedException;
import com.bookstore.backend.exception.InvalidBookRequestException;
import com.bookstore.backend.exception.ResourceNotFoundException;
import com.bookstore.backend.repository.BookRepository;
import com.bookstore.backend.repository.CategoryRepository;
import com.bookstore.backend.repository.OrderItemRepository;
import com.bookstore.backend.service.BookService;
import lombok.RequiredArgsConstructor;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final OrderItemRepository orderItemRepository;
    @Value("${app.file.storage-path}")
    private String storagePath;

    @Override
    public Page<BookResponse> searchBooks(String search, Long categoryId, BookFormat format, Pageable pageable) {
        return bookRepository.search(search, categoryId, format, pageable)
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
        validateStockQuantity(request.getFormat(), request.getStockQuantity());

        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .isbn(request.getIsbn())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(resolveStockQuantity(request.getFormat(), request.getStockQuantity()))
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

        validateStockQuantity(request.getFormat(), request.getStockQuantity());

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setDescription(request.getDescription());
        book.setPrice(request.getPrice());
        book.setStockQuantity(resolveStockQuantity(request.getFormat(), request.getStockQuantity()));
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
    
    private void validateStockQuantity(BookFormat format, Integer stockQuantity) {
        if (format == BookFormat.PHYSICAL && stockQuantity == null) {
            throw new InvalidBookRequestException("Stock quantity is required for physical books");
        }
    }

    // Digital books don't track stock — licenses aren't inventory, see contract 4b.
    // Whatever the admin sends for stockQuantity on a non-physical book is ignored;
    // the column stays non-nullable at the DB level, so we force it to 0 rather
    // than leaving it meaningful-but-unused.
    private Integer resolveStockQuantity(BookFormat format, Integer stockQuantity) {
        return format == BookFormat.PHYSICAL ? stockQuantity : 0;
    }
    
    @Override
    public org.springframework.core.io.Resource downloadBook(Long bookId, Long userId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + bookId));

        if (book.getFormat() == BookFormat.PHYSICAL) {
            throw new BookNotDigitalException();
        }

        boolean purchased = orderItemRepository.userHasPurchasedBook(userId, bookId);
        if (!purchased) {
            throw new BookNotPurchasedException();
        }

        try {
            Path filePath = Paths.get(storagePath).resolve(book.getFileUrl()).normalize();
            org.springframework.core.io.Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new ResourceNotFoundException("Digital file not found for book id: " + bookId);
            }

            return resource;
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Digital file not found for book id: " + bookId);
        }
    }
    
    @Override
    public PurchaseStatusResponse getPurchaseStatus(Long bookId, Long userId) {
        if (!bookRepository.existsById(bookId)) {
            throw new ResourceNotFoundException("Book not found with id: " + bookId);
        }
        boolean purchased = orderItemRepository.userHasPurchasedBook(userId, bookId);
        return new PurchaseStatusResponse(purchased);
    }
}
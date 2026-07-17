package com.bookstore.backend.controller;

import com.bookstore.backend.dto.AdminBookResponse;
import com.bookstore.backend.dto.ApiResponse;
import com.bookstore.backend.entity.Book;
import com.bookstore.backend.exception.ResourceNotFoundException;
import com.bookstore.backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/books")
@RequiredArgsConstructor
public class AdminBookController {

    private final BookRepository bookRepository;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminBookResponse>> getBookForAdmin(@PathVariable Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return ResponseEntity.ok(ApiResponse.of(AdminBookResponse.fromEntity(book)));
    }
}
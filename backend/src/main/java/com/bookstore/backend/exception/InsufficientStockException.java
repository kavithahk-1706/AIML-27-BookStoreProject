package com.bookstore.backend.exception;

public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String bookTitle) {
        super("Not enough stock available for: " + bookTitle);
    }
}
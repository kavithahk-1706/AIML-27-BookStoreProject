package com.bookstore.backend.exception;

public class InvalidBookRequestException extends RuntimeException {
    public InvalidBookRequestException(String message) {
        super(message);
    }
}
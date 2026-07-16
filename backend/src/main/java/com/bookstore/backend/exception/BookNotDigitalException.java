package com.bookstore.backend.exception;

public class BookNotDigitalException extends RuntimeException {
    public BookNotDigitalException() {
        super("This book is not available for digital download");
    }
}
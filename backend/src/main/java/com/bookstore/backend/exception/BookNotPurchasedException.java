package com.bookstore.backend.exception;

public class BookNotPurchasedException extends RuntimeException {
    public BookNotPurchasedException() {
        super("You need to purchase this book before you can download it");
    }
}
package com.bookstore.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

// { "error": "SHORT_CODE", "message": "human readable message" } per the API contract doc.
@Getter
@AllArgsConstructor
public class ApiError {
    private String error;
    private String message;
}

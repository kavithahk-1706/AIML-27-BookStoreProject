package com.bookstore.backend.dto;

import lombok.Getter;

// Wraps every successful response in { "data": ..., "message": ... }
// per the API contract doc — keep this consistent across every controller.
@Getter
public class ApiResponse<T> {
    private final T data;
    private final String message;

    private ApiResponse(T data, String message) {
        this.data = data;
        this.message = message;
    }

    public static <T> ApiResponse<T> of(T data) {
        return new ApiResponse<>(data, null);
    }

    public static <T> ApiResponse<T> of(T data, String message) {
        return new ApiResponse<>(data, message);
    }
}

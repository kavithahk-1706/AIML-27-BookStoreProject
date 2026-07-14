package com.bookstore.backend.controller;

import com.bookstore.backend.dto.ApiResponse;
import com.bookstore.backend.dto.AuthResponse;
import com.bookstore.backend.dto.LoginRequest;
import com.bookstore.backend.dto.RegisterRequest;
import com.bookstore.backend.dto.UserResponse;
import com.bookstore.backend.entity.User;
import com.bookstore.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.of(response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal User user) {
        // @AuthenticationPrincipal works directly here because User implements UserDetails
        // and that's the object JwtAuthFilter puts in the SecurityContext.
        UserResponse response = authService.getCurrentUser(user);
        return ResponseEntity.ok(ApiResponse.of(response));
    }
}

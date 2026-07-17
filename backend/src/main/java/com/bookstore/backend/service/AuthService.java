package com.bookstore.backend.service;

import com.bookstore.backend.dto.AuthResponse;
import com.bookstore.backend.dto.LoginRequest;
import com.bookstore.backend.dto.ProfileUpdateRequest;
import com.bookstore.backend.dto.RegisterRequest;
import com.bookstore.backend.dto.UserResponse;
import com.bookstore.backend.entity.User;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserResponse getCurrentUser(User authenticatedUser);
    AuthResponse updateProfile(User currentUser, ProfileUpdateRequest request);
}

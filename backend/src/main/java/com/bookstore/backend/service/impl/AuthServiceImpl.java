package com.bookstore.backend.service.impl;

import com.bookstore.backend.dto.AuthResponse;
import com.bookstore.backend.dto.LoginRequest;
import com.bookstore.backend.dto.RegisterRequest;
import com.bookstore.backend.dto.UserResponse;
import com.bookstore.backend.entity.Role;
import com.bookstore.backend.entity.User;
import com.bookstore.backend.exception.DuplicateEmailException;
import com.bookstore.backend.exception.InvalidCredentialsException;
import com.bookstore.backend.repository.UserRepository;
import com.bookstore.backend.security.JwtService;
import com.bookstore.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER) // registration always creates a normal user, never an admin
                .build();

        User saved = userRepository.save(user);
        return UserResponse.fromEntity(saved);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException();
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(InvalidCredentialsException::new);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, UserResponse.fromEntity(user));
    }

    @Override
    public UserResponse getCurrentUser(User authenticatedUser) {
        return UserResponse.fromEntity(authenticatedUser);
    }
}

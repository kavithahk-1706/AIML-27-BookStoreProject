package com.bookstore.backend.dto;

import com.bookstore.backend.entity.Role;
import com.bookstore.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

// What we send back to the client for "current user" info.
// Deliberately excludes passwordHash — never send that anywhere, ever.
@Getter
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;

    public static UserResponse fromEntity(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}

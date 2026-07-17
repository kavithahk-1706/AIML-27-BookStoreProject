package com.bookstore.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileUpdateRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Current password is required")
    private String currentPassword;

    // Optional — omit/leave blank to keep current password. Only validated
    // if actually provided, same min-length rule as registration.
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String newPassword;
}
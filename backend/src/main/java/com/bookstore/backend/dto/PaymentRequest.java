package com.bookstore.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

// Body is validated for SHAPE ONLY — this is a simulation, never persisted,
// never touches a real payment processor. See contract section 4a.
@Getter
@Setter
public class PaymentRequest {

    @NotBlank(message = "Card number is required")
    private String cardNumber;

    @NotBlank(message = "Expiry is required")
    private String expiry;

    @NotBlank(message = "CVV is required")
    private String cvv;
}
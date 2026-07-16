package com.bookstore.backend.dto;

import com.bookstore.backend.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderStatusRequest {

    @NotNull(message = "Status is required")
    private OrderStatus status;
}
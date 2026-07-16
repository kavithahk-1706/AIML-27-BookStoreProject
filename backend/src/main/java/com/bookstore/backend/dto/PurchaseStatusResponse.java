package com.bookstore.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PurchaseStatusResponse {
    private boolean purchased;
}
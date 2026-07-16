package com.bookstore.backend.dto;

import com.bookstore.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OrderUserSummary {
    private Long id;
    private String name;
    private String email;

    public static OrderUserSummary fromEntity(User user) {
        return new OrderUserSummary(user.getId(), user.getName(), user.getEmail());
    }
}
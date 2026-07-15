package com.bookstore.backend.dto;

import com.bookstore.backend.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CategoryResponse {

    private Long id;
    private String name;

    public static CategoryResponse fromEntity(Category category) {
        return new CategoryResponse(category.getId(), category.getName());
    }
}
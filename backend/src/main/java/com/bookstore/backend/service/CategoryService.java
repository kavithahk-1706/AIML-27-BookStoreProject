package com.bookstore.backend.service;

import com.bookstore.backend.dto.CategoryRequest;
import com.bookstore.backend.dto.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();
    CategoryResponse createCategory(CategoryRequest request);
}
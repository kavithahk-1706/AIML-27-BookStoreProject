package com.bookstore.backend.service.impl;

import com.bookstore.backend.dto.CategoryRequest;
import com.bookstore.backend.dto.CategoryResponse;
import com.bookstore.backend.entity.Category;
import com.bookstore.backend.repository.CategoryRepository;
import com.bookstore.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponse::fromEntity)
                .toList();
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .build();
        return CategoryResponse.fromEntity(categoryRepository.save(category));
    }
}
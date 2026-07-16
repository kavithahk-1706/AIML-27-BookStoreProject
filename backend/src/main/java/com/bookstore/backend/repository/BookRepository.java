package com.bookstore.backend.repository;

import com.bookstore.backend.entity.Book;
import com.bookstore.backend.entity.BookFormat;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookRepository extends JpaRepository<Book, Long> {

    // search and categoryId are both optional (nullable) — this single query
    // handles: no filters, search only, category only, or both together.
    @Query("""
            SELECT b FROM Book b
            WHERE (:search IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%'))
                                    OR LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:categoryId IS NULL OR b.category.id = :categoryId)
            """)
    Page<Book> search(@Param("search") String search,
                       @Param("categoryId") Long categoryId,
                       Pageable pageable);
    
    @Query("""
            SELECT b FROM Book b
            WHERE (:search IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%'))
                                    OR LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:categoryId IS NULL OR b.category.id = :categoryId)
              AND (:format IS NULL OR b.format = :format)
            """)
    Page<Book> search(@Param("search") String search,
                       @Param("categoryId") Long categoryId,
                       @Param("format") BookFormat format,
                       Pageable pageable);

    // Atomic row-level decrement — the WHERE clause's stock check means this
    // can never take stock negative, even under concurrent checkouts hitting
    // the last copy at the same time. Returns 0 rows updated if there wasn't
    // enough stock; the caller checks that and throws accordingly.
    @Modifying
    @Query("UPDATE Book b SET b.stockQuantity = b.stockQuantity - :quantity " +
           "WHERE b.id = :bookId AND b.stockQuantity >= :quantity")
    int decrementStock(@Param("bookId") Long bookId, @Param("quantity") Integer quantity);

    // Used to release stock back when a payment fails. Same atomic-update
    // pattern as decrementStock, just no race condition to guard against here
    // since we're always adding back, never risking going negative.
    @Modifying
    @Query("UPDATE Book b SET b.stockQuantity = b.stockQuantity + :quantity WHERE b.id = :bookId")
    int incrementStock(@Param("bookId") Long bookId, @Param("quantity") Integer quantity);
}
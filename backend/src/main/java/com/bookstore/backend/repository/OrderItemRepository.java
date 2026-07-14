package com.bookstore.backend.repository;

import com.bookstore.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Used by the /books/{id}/download endpoint to check the user actually
    // bought this book before letting them download it.
    @Query("""
            SELECT COUNT(oi) > 0 FROM OrderItem oi
            WHERE oi.order.user.id = :userId
              AND oi.book.id = :bookId
              AND oi.order.status IN ('CONFIRMED', 'DELIVERED')
            """)
    boolean userHasPurchasedBook(@Param("userId") Long userId, @Param("bookId") Long bookId);
}

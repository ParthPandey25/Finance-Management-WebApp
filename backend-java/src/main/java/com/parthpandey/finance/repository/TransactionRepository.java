package com.parthpandey.finance.repository;

import com.parthpandey.finance.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // Mitigates BOLA/IDOR: Parameterized retrieval filtered strictly by the authenticated user's email
    List<Transaction> findByUserEmailOrderByCreatedAtDesc(String email);

    // Mitigates IDOR: Parameterized retrieval validating both record ID and owning user's email
    Optional<Transaction> findByIdAndUserEmail(Long id, String email);
}

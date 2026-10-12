package com.parthpandey.finance.controller;

import com.parthpandey.finance.dto.TransactionRequest;
import com.parthpandey.finance.dto.TransactionResponse;
import com.parthpandey.finance.entity.Transaction;
import com.parthpandey.finance.entity.User;
import com.parthpandey.finance.repository.TransactionRepository;
import com.parthpandey.finance.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@PreAuthorize("isAuthenticated()")
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionController(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    /**
     * Mitigates BOLA / IDOR (OWASP API1:2023 / CWE-639):
     * The query is parameter-scoped strictly to authentication.getName().
     * An attacker cannot supply another user's identifier to view their records.
     */
    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getMyTransactions(Authentication authentication) {
        String email = authentication.getName();
        List<Transaction> transactions = transactionRepository.findByUserEmailOrderByCreatedAtDesc(email);

        List<TransactionResponse> response = transactions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    /**
     * Mitigates Mass Assignment & Injection (OWASP API3:2023 / CWE-915):
     * Validates input fields using Jakarta Bean Validation (@Valid).
     * Hard-binds transaction ownership directly to the authenticated principal.
     */
    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@Valid @RequestBody TransactionRequest request,
                                                                 Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        Transaction transaction = new Transaction(
                request.getTransaction(),
                request.getTransactionType(),
                request.getCatagory(),
                request.getAmount(),
                user
        );

        Transaction saved = transactionRepository.save(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(saved));
    }

    /**
     * Mitigates Insecure Direct Object Reference (IDOR) on Deletion:
     * Enforces dual-condition validation: checks both transaction ID and ownership email.
     * Prevents an authenticated user from deleting transactions owned by another account.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();

        // Check if the record exists AND belongs to the caller
        Transaction transaction = transactionRepository.findByIdAndUserEmail(id, email)
                .orElse(null);

        if (transaction == null) {
            // Return 403 Forbidden to reflect unauthorized resource tampering
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access Denied: You do not have permission to delete this resource"));
        }

        transactionRepository.delete(transaction);
        return ResponseEntity.ok(Map.of("message", "Transaction deleted successfully", "id", id));
    }

    /**
     * Mitigates Insecure Direct Object Reference (IDOR) on Modification:
     * Enforces dual-condition validation: checks both transaction ID and ownership email before updating.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(@PathVariable Long id,
                                               @Valid @RequestBody TransactionRequest request,
                                               Authentication authentication) {
        String email = authentication.getName();

        Transaction transaction = transactionRepository.findByIdAndUserEmail(id, email)
                .orElse(null);

        if (transaction == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access Denied: You do not have permission to modify this resource"));
        }

        transaction.setTransaction(request.getTransaction());
        transaction.setTransactionType(request.getTransactionType());
        transaction.setCatagory(request.getCatagory());
        transaction.setAmount(request.getAmount());

        Transaction saved = transactionRepository.save(transaction);
        return ResponseEntity.ok(mapToResponse(saved));
    }

    private TransactionResponse mapToResponse(Transaction t) {
        return new TransactionResponse(
                t.getId(),
                t.getTransaction(),
                t.getTransactionType(),
                t.getCatagory(),
                t.getAmount(),
                t.getUser().getEmail(),
                t.getCreatedAt()
        );
    }
}

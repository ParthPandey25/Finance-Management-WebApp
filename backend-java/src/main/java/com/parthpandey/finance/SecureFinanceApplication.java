package com.parthpandey.finance;

import com.parthpandey.finance.entity.Transaction;
import com.parthpandey.finance.entity.User;
import com.parthpandey.finance.repository.TransactionRepository;
import com.parthpandey.finance.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class SecureFinanceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SecureFinanceApplication.class, args);
    }

    /**
     * Database Seed Runner:
     * Seeds initial test accounts with BCrypt-hashed credentials and test financial data.
     */
    @Bean
    public CommandLineRunner seedDatabase(UserRepository userRepository,
                                         TransactionRepository transactionRepository,
                                         PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                System.out.println(">>> Initializing Secure Finance Database Seed Data...");

                // 1. Primary Auditor Account: Parth Pandey
                User parth = new User(
                        "parth@finance.local",
                        passwordEncoder.encode("Password123!"),
                        "Parth Pandey",
                        "ROLE_ADMIN"
                );
                userRepository.save(parth);

                // 2. Secondary User: Alice Sharma (Used for IDOR / BOLA multi-tenant testing)
                User alice = new User(
                        "alice@finance.local",
                        passwordEncoder.encode("Password123!"),
                        "Alice Sharma",
                        "ROLE_USER"
                );
                userRepository.save(alice);

                // 3. Transactions for Parth Pandey
                transactionRepository.save(new Transaction("Cybersecurity Audit Retainer", "Income", "Consulting", 120000.0, parth));
                transactionRepository.save(new Transaction("Bug Bounty Reward (Critical)", "Income", "Security Bounty", 45000.0, parth));
                transactionRepository.save(new Transaction("Cloud Infrastructure (AWS/Vercel)", "Expense", "Infrastructure", 14500.0, parth));
                transactionRepository.save(new Transaction("Hardware Security Keys (YubiKey)", "Expense", "Hardware", 6200.0, parth));
                transactionRepository.save(new Transaction("Ergonomic Workspace & Display", "Expense", "Office", 28000.0, parth));
                transactionRepository.save(new Transaction("High-Speed Fiber Internet", "Expense", "Utilities", 2800.0, parth));

                // 4. Transactions for Alice Sharma (Confidential to Alice)
                transactionRepository.save(new Transaction("Software Engineering Salary", "Income", "Salary", 95000.0, alice));
                transactionRepository.save(new Transaction("Apartment Lease Payment", "Expense", "Housing", 22000.0, alice));

                System.out.println(">>> Seed Data Initialized Successfully: Parth Pandey & Alice Sharma accounts created.");
            }
        };
    }
}

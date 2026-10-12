package com.parthpandey.finance.dto;

import java.time.LocalDateTime;

public class TransactionResponse {

    private Long id;
    private String transaction;
    private String transactionType;
    private String catagory;
    private Double amount;
    private String userEmail;
    private LocalDateTime createdAt;

    public TransactionResponse() {}

    public TransactionResponse(Long id, String transaction, String transactionType, String catagory, Double amount, String userEmail, LocalDateTime createdAt) {
        this.id = id;
        this.transaction = transaction;
        this.transactionType = transactionType;
        this.catagory = catagory;
        this.amount = amount;
        this.userEmail = userEmail;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransaction() {
        return transaction;
    }

    public void setTransaction(String transaction) {
        this.transaction = transaction;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getCatagory() {
        return catagory;
    }

    public void setCatagory(String catagory) {
        this.catagory = catagory;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

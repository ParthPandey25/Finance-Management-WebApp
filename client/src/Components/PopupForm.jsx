import React, { useState } from "react";
import "./PopupForm.css";

function PopupForm({ onSubmit, isOpen, onClose }) {
  const [transaction, setTransaction] = useState("");
  const [transactionType, setTransactionType] = useState("Expense");
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transaction.trim()) {
      setError("Please enter a transaction title.");
      return;
    }
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    setError("");
    onSubmit(transaction.trim(), transactionType, category, numAmount);
    setTransaction("");
    setAmount("");
    onClose();
  };

  const handleCancel = () => {
    setError("");
    onClose();
  };

  return (
    <div className="popup-overlay" onClick={handleCancel}>
      <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3>Record New Transaction</h3>
          <button type="button" className="popup-close-x" onClick={handleCancel}>
            &times;
          </button>
        </div>

        {error && <div className="popup-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="popup-form-body">
          <div className="popup-field">
            <label>Transaction Title</label>
            <input
              type="text"
              className="popup-input"
              placeholder="e.g. Cloud Server Hosting / Consulting"
              value={transaction}
              onChange={(e) => {
                setTransaction(e.target.value);
                if (error) setError("");
              }}
              autoFocus
              required
            />
          </div>

          <div className="popup-row">
            <div className="popup-field">
              <label>Type</label>
              <select
                className="popup-select"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
            </div>

            <div className="popup-field">
              <label>Category</label>
              <select
                className="popup-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Infrastructure">Infrastructure</option>
                <option value="Consulting">Consulting</option>
                <option value="Security Bounty">Security Bounty</option>
                <option value="Hardware">Hardware</option>
                <option value="Office">Office</option>
                <option value="Utilities">Utilities</option>
                <option value="Food">Food</option>
                <option value="Housing">Housing</option>
                <option value="Salary">Salary</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="popup-field">
            <label>Amount (Rs.)</label>
            <input
              type="number"
              className="popup-input"
              placeholder="e.g. 15000"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError("");
              }}
              min="1"
              required
            />
          </div>

          <div className="popup-actions">
            <button
              type="button"
              className="popup-btn-cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className="popup-btn-submit">
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PopupForm;

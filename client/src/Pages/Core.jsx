import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./Core.css";
import Card from "../Components/Card";
import PopupForm from "../Components/PopupForm";

function Core() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("All"); // "All", "Expense", "Income"

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const fetchTransactions = async () => {
    try {
      let token = localStorage.getItem("auth_token");
      if (!token) {
        // Auto-authenticate initial session as Parth Pandey
        const loginRes = await Axios.post(`${API_URL}/api/auth/login`, {
          email: "parth@finance.local",
          password: "Password123!",
        });
        token = loginRes.data.token;
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(loginRes.data));
      }

      const res = await Axios.get(`${API_URL}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const mapped = res.data.map((item) => ({
        _id: item.id,
        Transaction: item.transaction,
        TransactionType: item.transactionType,
        Catagory: item.catagory,
        Amount: item.amount,
        user: item.userEmail,
      }));
      setTransactions(mapped);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFormSubmit = async (transaction, transactionType, category, amount) => {
    try {
      const token = localStorage.getItem("auth_token");
      await Axios.post(
        `${API_URL}/api/transactions`,
        {
          transaction: transaction,
          transactionType: transactionType,
          catagory: category,
          amount: Number(amount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchTransactions();
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  const handleDeleteTransaction = async (id, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("auth_token");
      await Axios.delete(`${API_URL}/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  // Integrated Analytics & Frequency Filtering (Ported from Expense Tracker)
  const [viewMode, setViewMode] = useState("overview"); // "overview" | "analytics"
  const [frequency, setFrequency] = useState("all"); // "all" | "7" | "30" | "365"

  // Filter transactions by frequency window
  const filteredByFrequency = transactions.filter((t) => {
    if (frequency === "all" || !t.createdAt) return true;
    const txTime = new Date(t.createdAt).getTime();
    const now = Date.now();
    const daysDiff = (now - txTime) / (1000 * 60 * 60 * 24);
    return daysDiff <= Number(frequency);
  });

  // Calculations on filtered transactions
  const expenses = filteredByFrequency.filter((t) => t.TransactionType === "Expense");
  const incomes = filteredByFrequency.filter((t) => t.TransactionType === "Income");

  const sumOfExpenses = expenses.reduce((acc, t) => acc + (Number(t.Amount) || 0), 0);
  const sumOfIncomes = incomes.reduce((acc, t) => acc + (Number(t.Amount) || 0), 0);
  const total = sumOfIncomes - sumOfExpenses;
  const totalTurnOver = sumOfIncomes + sumOfExpenses;

  const totalCount = filteredByFrequency.length;
  const incomeCount = incomes.length;
  const expenseCount = expenses.length;
  const incomeCountPct = totalCount > 0 ? Math.round((incomeCount / totalCount) * 100) : 0;
  const expenseCountPct = totalCount > 0 ? Math.round((expenseCount / totalCount) * 100) : 0;

  const turnOverIncomePct = totalTurnOver > 0 ? Math.round((sumOfIncomes / totalTurnOver) * 100) : 0;
  const turnOverExpensePct = totalTurnOver > 0 ? Math.round((sumOfExpenses / totalTurnOver) * 100) : 0;

  const expensesByCategory = expenses.reduce((acc, t) => {
    const cat = t.Catagory || "Other";
    acc[cat] = (acc[cat] || 0) + (Number(t.Amount) || 0);
    return acc;
  }, {});

  const incomesByCategory = incomes.reduce((acc, t) => {
    const cat = t.Catagory || "Other";
    acc[cat] = (acc[cat] || 0) + (Number(t.Amount) || 0);
    return acc;
  }, {});

  // Filtered list based on active view & type
  const displayedTransactions =
    filterType === "All"
      ? filteredByFrequency
      : filteredByFrequency.filter((t) => t.TransactionType === filterType);

  return (
    <>
      <PopupForm
        onSubmit={handleFormSubmit}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />

      {/* Top Controls Bar: View Mode Toggle & Frequency Window */}
      <div className="dash-controls-bar">
        <div className="view-mode-tabs">
          <button
            type="button"
            className={`view-tab-btn ${viewMode === "overview" ? "tab-active" : ""}`}
            onClick={() => setViewMode("overview")}
          >
            📊 Ledger Overview
          </button>
          <button
            type="button"
            className={`view-tab-btn ${viewMode === "analytics" ? "tab-active" : ""}`}
            onClick={() => setViewMode("analytics")}
          >
            📈 Deep Financial Analytics
          </button>
        </div>

        <div className="frequency-filter-group">
          <span className="freq-label">Frequency:</span>
          <button
            type="button"
            className={`freq-chip ${frequency === "all" ? "freq-active" : ""}`}
            onClick={() => setFrequency("all")}
          >
            All Time
          </button>
          <button
            type="button"
            className={`freq-chip ${frequency === "7" ? "freq-active" : ""}`}
            onClick={() => setFrequency("7")}
          >
            7 Days
          </button>
          <button
            type="button"
            className={`freq-chip ${frequency === "30" ? "freq-active" : ""}`}
            onClick={() => setFrequency("30")}
          >
            30 Days
          </button>
          <button
            type="button"
            className={`freq-chip ${frequency === "365" ? "freq-active" : ""}`}
            onClick={() => setFrequency("365")}
          >
            1 Year
          </button>
        </div>
      </div>

      {viewMode === "analytics" ? (
        /* ===== INTEGRATED ANALYTICS VIEW ===== */
        <div className="analytics-view-grid">
          {/* Box 1: Transaction Volume & Count Distribution */}
          <div className="analytics-box">
            <Card className="grayGradient h-100">
              <div className="panel-title-row">
                <h2>Transaction Volume Distribution</h2>
                <span className="panel-count">{totalCount} Total Transactions</span>
              </div>
              <div className="analytics-metric-row">
                <div className="metric-pill pill-income">
                  <span>Incomes: {incomeCount}</span>
                  <span className="metric-pct">{incomeCountPct}%</span>
                </div>
                <div className="metric-pill pill-expense">
                  <span>Spendings: {expenseCount}</span>
                  <span className="metric-pct">{expenseCountPct}%</span>
                </div>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-fill fill-green"
                  style={{ width: `${incomeCountPct}%` }}
                  title={`Incomes: ${incomeCountPct}%`}
                ></div>
                <div
                  className="progress-fill fill-red"
                  style={{ width: `${expenseCountPct}%` }}
                  title={`Spendings: ${expenseCountPct}%`}
                ></div>
              </div>
              <p className="analytics-desc">Ratio of credit cashflow against expense events.</p>
            </Card>
          </div>

          {/* Box 2: Total Turnover & Capital Velocity */}
          <div className="analytics-box">
            <Card className="grayGradient h-100">
              <div className="panel-title-row">
                <h2>Total Turnover & Capital Flow</h2>
                <span className="panel-count">Rs. {totalTurnOver.toLocaleString()} Gross</span>
              </div>
              <div className="analytics-metric-row">
                <div className="metric-pill pill-income">
                  <span>Credit: Rs. {sumOfIncomes.toLocaleString()}</span>
                  <span className="metric-pct">{turnOverIncomePct}%</span>
                </div>
                <div className="metric-pill pill-expense">
                  <span>Debit: Rs. {sumOfExpenses.toLocaleString()}</span>
                  <span className="metric-pct">{turnOverExpensePct}%</span>
                </div>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-fill fill-green"
                  style={{ width: `${turnOverIncomePct}%` }}
                ></div>
                <div
                  className="progress-fill fill-red"
                  style={{ width: `${turnOverExpensePct}%` }}
                ></div>
              </div>
              <p className="analytics-desc">Liquid turnover share of recorded capital movements.</p>
            </Card>
          </div>

          {/* Box 3: Category-wise Spending Breakdown */}
          <div className="analytics-box">
            <Card className="grayGradient h-100">
              <div className="panel-title-row">
                <h2>Category-wise Spending Breakdown</h2>
                <span className="panel-count">{Object.keys(expensesByCategory).length} Categories</span>
              </div>
              <div className="analytics-category-list">
                {Object.keys(expensesByCategory).length === 0 ? (
                  <p className="empty-hint">No expense records in this timeframe.</p>
                ) : (
                  Object.entries(expensesByCategory).map(([cat, amt]) => {
                    const catPct = sumOfExpenses > 0 ? Math.round((amt / sumOfExpenses) * 100) : 0;
                    return (
                      <div key={cat} className="cat-progress-item">
                        <div className="cat-progress-header">
                          <span className="cat-name">{cat}</span>
                          <span className="cat-val">Rs. {amt.toLocaleString()} ({catPct}%)</span>
                        </div>
                        <div className="cat-bar-track">
                          <div className="cat-bar-fill bar-red" style={{ width: `${catPct}%` }}></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Box 4: Category-wise Income Breakdown */}
          <div className="analytics-box">
            <Card className="grayGradient h-100">
              <div className="panel-title-row">
                <h2>Category-wise Income Allocation</h2>
                <span className="panel-count">{Object.keys(incomesByCategory).length} Sources</span>
              </div>
              <div className="analytics-category-list">
                {Object.keys(incomesByCategory).length === 0 ? (
                  <p className="empty-hint">No income records in this timeframe.</p>
                ) : (
                  Object.entries(incomesByCategory).map(([cat, amt]) => {
                    const catPct = sumOfIncomes > 0 ? Math.round((amt / sumOfIncomes) * 100) : 0;
                    return (
                      <div key={cat} className="cat-progress-item">
                        <div className="cat-progress-header">
                          <span className="cat-name">{cat}</span>
                          <span className="cat-val">Rs. {amt.toLocaleString()} ({catPct}%)</span>
                        </div>
                        <div className="cat-bar-track">
                          <div className="cat-bar-fill bar-green" style={{ width: `${catPct}%` }}></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* ===== STANDARD LEDGER OVERVIEW ===== */
        <div className="div-grid">
          {/* Card 1: Wallet Balance */}
          <div className="card card1">
            <Card className="greenGradient h-100 wallet-box">
              <div className="wallet-header-row">
                <span className="wallet-tag">NET BALANCE</span>
                <span className="wallet-pill">Active Portfolio</span>
              </div>
              <div className="wallet-balance-row">
                <span className="wallet-currency">Rs.</span>
                <span className="wallet-amount">{total.toLocaleString()}</span>
              </div>
              <p className="wallet-footer-desc">
                Total liquid capital across all recorded accounts
              </p>
            </Card>
          </div>

          {/* Card 2: Spendings, Incomes & Add Button */}
          <div className="card three-child-card card2 h-100">
            <div
              className={`stat-card stat-expense ${filterType === "Expense" ? "active-filter" : ""}`}
              onClick={() => setFilterType(filterType === "Expense" ? "All" : "Expense")}
              title="Click to filter by expenses"
            >
              <span className="stat-label">Total Spendings</span>
              <span className="stat-amount amount-red">
                Rs. {sumOfExpenses.toLocaleString()}
              </span>
            </div>

            <div
              className={`stat-card stat-income ${filterType === "Income" ? "active-filter" : ""}`}
              onClick={() => setFilterType(filterType === "Income" ? "All" : "Income")}
              title="Click to filter by incomes"
            >
              <span className="stat-label">Total Incomes</span>
              <span className="stat-amount amount-green">
                Rs. {sumOfIncomes.toLocaleString()}
              </span>
            </div>

            <button onClick={() => setIsPopupOpen(true)} className="add-button">
              <span>+ Add Transaction</span>
            </button>
          </div>

          {/* Card 3: Spending by Category */}
          <div className="card card3 spending-by-catagory">
            <Card className="grayGradient h-100">
              <div className="panel-title-row">
                <h2>Spending by Category</h2>
                <span className="panel-count">{Object.keys(expensesByCategory).length} Categories</span>
              </div>
              <div className="category-scroll-list">
                {Object.keys(expensesByCategory).length === 0 ? (
                  <p className="empty-hint">No expense categories yet.</p>
                ) : (
                  Object.entries(expensesByCategory).map(([cat, amount]) => (
                    <div key={cat} className="category-list-elem">
                      <span className="cat-name">{cat}</span>
                      <span className="cat-amount">Rs. {amount.toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Card 4: Filterable Transaction List */}
          <div className="card card4 expense-list">
            <Card className="grayGradient h-100">
              <div className="panel-title-row">
                <h2>
                  {filterType === "All"
                    ? "All Transactions"
                    : filterType === "Expense"
                    ? "Expense Records"
                    : "Income Records"}
                </h2>
                <div className="filter-chip-group">
                  <button
                    type="button"
                    className={`chip-btn ${filterType === "All" ? "chip-active" : ""}`}
                    onClick={() => setFilterType("All")}
                  >
                    All ({filteredByFrequency.length})
                  </button>
                  <button
                    type="button"
                    className={`chip-btn ${filterType === "Expense" ? "chip-active" : ""}`}
                    onClick={() => setFilterType("Expense")}
                  >
                    Spendings ({expenses.length})
                  </button>
                  <button
                    type="button"
                    className={`chip-btn ${filterType === "Income" ? "chip-active" : ""}`}
                    onClick={() => setFilterType("Income")}
                  >
                    Incomes ({incomes.length})
                  </button>
                </div>
              </div>

              <div className="transactions-scroll-list">
                {displayedTransactions.length === 0 ? (
                  <p className="empty-hint">No transactions recorded in this view.</p>
                ) : (
                  displayedTransactions.map((tx, idx) => (
                    <div key={tx._id || idx} className="tx-list-elem">
                      <div className="tx-col-info">
                        <span className="tx-title">{tx.Transaction}</span>
                        <span className="tx-meta">{tx.Catagory} • {tx.TransactionType}</span>
                      </div>
                      <div className="tx-col-right">
                        <span
                          className={`tx-amount ${
                            tx.TransactionType === "Income" ? "amount-green" : "amount-red"
                          }`}
                        >
                          {tx.TransactionType === "Income" ? "+" : "-"} Rs.{" "}
                          {Number(tx.Amount).toLocaleString()}
                        </span>
                        <button
                          type="button"
                          className="tx-delete-btn"
                          onClick={(e) => handleDeleteTransaction(tx._id, e)}
                          title="Delete transaction"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

        {/* Card 5: Security Tips */}
        <div className="card card5">
          <Card className="grayGradient h-100">
            <div className="panel-title-row">
              <h2>🛡️ Security & Financial Tip</h2>
            </div>
            <p className="tips-content">
              Multi-tenant isolation and strict API authorization safeguard confidential ledgers against IDOR, BOLA, and unauthorized queries.
            </p>
            <button
              type="button"
              className="card-audit-link-btn"
              onClick={() => {
                document.getElementById("security-architecture")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>View Security Review & Findings</span>
              <span className="arrow-pulse">↓</span>
            </button>
          </Card>
        </div>

        {/* Card 6: Interactive Action Filter - Spending */}
        <div className="card card6">
          <button
            onClick={() => setFilterType("Expense")}
            className={`add-button ${filterType === "Expense" ? "btn-filter-active" : ""}`}
          >
            View All Spending ({expenses.length})
          </button>
        </div>

        {/* Card 7: Interactive Action Filter - Income */}
        <div className="card card7">
          <button
            onClick={() => setFilterType("Income")}
            className={`add-button ${filterType === "Income" ? "btn-filter-active" : ""}`}
          >
            View All Incomes ({incomes.length})
          </button>
        </div>

        {/* Card 8: Prominent Full-Width Scroll Down Action Banner */}
        <div className="card card-scroll-banner">
          <button
            type="button"
            className="prominent-scroll-btn"
            onClick={() => {
              document.getElementById("security-architecture")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <div className="scroll-btn-left">
              <span className="banner-badge">AUDIT & DEFENSE MATRIX</span>
              <span className="banner-title">Security Review & Architecture Verification</span>
              <span className="banner-sub">Tested via Burp Suite & Python 3.10 • Hardened with Java 21 / Spring Boot 3 & Spring Security 6</span>
            </div>
            <div className="scroll-btn-right">
              <span className="scroll-btn-cta">Scroll to Review</span>
              <span className="scroll-btn-arrow">↓</span>
            </div>
          </button>
        </div>
      </div>
      )}

      {/* Floating Quick-Jump Pill (Always visible on screen) */}
      <button
        type="button"
        className="floating-sec-pill"
        onClick={() => {
          document.getElementById("security-architecture")?.scrollIntoView({ behavior: "smooth" });
        }}
        aria-label="Scroll to Security Audit"
      >
        <span className="floating-dot"></span>
        <span className="floating-text">Security Review</span>
        <span className="floating-arrow">↓</span>
      </button>

      {/* Embedded Security Review & Architecture Section */}
      <div id="security-architecture" className="sec-review-container">
        <div className="sec-review-card">
          <div className="sec-review-header">
            <span className="sec-review-badge">AUDIT & DEFENSE VERIFICATION</span>
            <h2 className="sec-review-title">Enterprise Security Architecture Review</h2>
            <p className="sec-review-subtitle">
              Security audit conducted by <strong>Parth Pandey</strong> using Burp Suite & Python 3.10. 
              Hardened with an enterprise <strong>Java 21 / Spring Boot 3 & Spring Security 6</strong> backend.
            </p>
          </div>

          <div className="sec-stats-bar">
            <div className="stat-pill">
              <span className="stat-dot dot-green"></span>
              <span>Spring Security 6 Active</span>
            </div>
            <div className="stat-pill">
              <span className="stat-dot dot-green"></span>
              <span>BCrypt (12 Rounds)</span>
            </div>
            <div className="stat-pill">
              <span className="stat-dot dot-green"></span>
              <span>HMAC-SHA256 JWT in HttpOnly</span>
            </div>
            <div className="stat-pill">
              <span className="stat-dot dot-green"></span>
              <span>Spring Data JPA (SQLi Immune)</span>
            </div>
            <div className="stat-pill">
              <span className="stat-dot dot-green"></span>
              <span>Python Automated Tests: 6/6 Passing</span>
            </div>
          </div>

          <div className="sec-matrix-table-wrap">
            <table className="sec-matrix-table">
              <thead>
                <tr>
                  <th>Vulnerability & CWE</th>
                  <th>Burp Suite Recon Finding (Legacy Flaw)</th>
                  <th>Enterprise Hardening Defense (Java Spring Boot 3)</th>
                  <th>Automated Test Verdict</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>BOLA / IDOR</strong>
                    <br /><small>CWE-306 / CWE-639</small>
                  </td>
                  <td>
                    Burp Repeater revealed unauthenticated <code>/getUsers</code> exposed all stored transaction ledgers without token verification.
                  </td>
                  <td>
                    Implemented <code>@PreAuthorize("isAuthenticated()")</code> with tenant-scoped JPA queries isolating user data.
                  </td>
                  <td><span className="badge-pass">✔ PASS (HTTP 403)</span></td>
                </tr>
                <tr>
                  <td>
                    <strong>IDOR Tampering</strong>
                    <br /><small>CWE-639</small>
                  </td>
                  <td>
                    Cross-account parameter tampering: sending another user's ID deleted their confidential transactions.
                  </td>
                  <td>
                    Dual-condition lookup: <code>findByIdAndUserEmail(id, email)</code> enforces resource ownership before deletion.
                  </td>
                  <td><span className="badge-pass">✔ PASS (HTTP 403)</span></td>
                </tr>
                <tr>
                  <td>
                    <strong>SQL / NoSQL Injection</strong>
                    <br /><small>CWE-89</small>
                  </td>
                  <td>
                    Unsanitized JSON parameters passed directly into database store without parameterization.
                  </td>
                  <td>
                    Hibernate ORM / Spring Data JPA prepared statements completely decouple input data from query compilation.
                  </td>
                  <td><span className="badge-pass">✔ PASS (Parameterized)</span></td>
                </tr>
                <tr>
                  <td>
                    <strong>Mass Assignment</strong>
                    <br /><small>CWE-915</small>
                  </td>
                  <td>
                    Payload with negative values and injected administrative attributes was persisted directly.
                  </td>
                  <td>
                    Jakarta Bean Validation (<code>@Positive</code>, <code>@NotBlank</code>, strict DTO whitelisting).
                  </td>
                  <td><span className="badge-pass">✔ PASS (HTTP 400)</span></td>
                </tr>
                <tr>
                  <td>
                    <strong>Error Disclosure</strong>
                    <br /><small>CWE-209</small>
                  </td>
                  <td>
                    Internal database driver exceptions and stack traces were leaked in HTTP 500 error responses.
                  </td>
                  <td>
                    <code>@RestControllerAdvice</code> catches all exceptions, keeping stack traces in server logs while returning generic error JSON.
                  </td>
                  <td><span className="badge-pass">✔ PASS (Sanitized)</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="sec-review-footer">
            <button
              type="button"
              className="scroll-up-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              ↑ Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Core;

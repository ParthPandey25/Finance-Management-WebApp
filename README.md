# Enterprise Secure Finance & Expense Management Platform

[![Java 21](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://openjdk.org/)
[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Security 6](https://img.shields.io/badge/Spring%20Security-6.1-green.svg)](https://spring.io/projects/spring-security)
[![Python 3.10](https://img.shields.io/badge/Python-3.10%20Pentest%20Suite-blue.svg)](https://python.org)
[![React 18](https://img.shields.io/badge/React-18%20Vite-61dafb.svg)](https://react.dev/)
[![OWASP Compliance](https://img.shields.io/badge/OWASP%20Top%2010-100%25%20Remediated-success.svg)](https://owasp.org/)

**Architected, Audited & Engineered by [Parth Pandey](https://github.com/ParthPandey25)**  
*Full-Stack Engineer & Application Security Specialist*

---

## 🌟 Overview

This repository features an enterprise-grade financial management, expense tracking, and ledger platform built from the ground up to demonstrate **end-to-end vulnerability assessment (Burp Suite)** and **banking-grade architectural hardening (Java 21 / Spring Boot 3 & Spring Security 6)**.

The project integrates the deep financial analytics capabilities of an expense management system with the multi-tenant isolation, cryptographic session management, and automated security verification of an enterprise banking backend.

```
       ┌────────────────────────────────────────────────────────┐
       │     Modern React 18 Client (Glassmorphism + 3D)        │
       │    Overview Ledger | Deep Analytics | Security Review  │
       └───────────────────────────┬────────────────────────────┘
                                   │ REST (HttpOnly JWT)
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │   Enterprise Java 21 / Spring Boot 3 / Spring Sec 6    │
       │    Method Security (@PreAuthorize) | Parameterized JPA │
       │    Jakarta Bean Validation | Exception Sanitization    │
       └───────────────────────────┬────────────────────────────┘
                                   │ H2 / PostgreSQL
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │      Automated Python 3.10 Pentest Suite (7/7 Pass)    │
       │    BOLA/IDOR | JWT Tampering | SQLi | Mass Assignment  │
       └────────────────────────────────────────────────────────┘
```

---

## 🛡️ Security Audit & Burp Suite Findings

During security reconnaissance using **Burp Suite Professional / Community (Proxy, Repeater, Intruder)**, multiple OWASP API vulnerabilities were discovered and documented:

| Vulnerability & CWE | Legacy Vulnerable State | Hardened Defense (Spring Boot 3 & Spring Security 6) | Verdict |
| :--- | :--- | :--- | :--- |
| **BOLA / IDOR (CWE-306 / 639)** | Missing authentication on `/getUsers` exposed all private transactions. | Method-level security (`@PreAuthorize`) + JPA parameterized tenancy scoping. | **✔ HTTP 403 Forbidden** |
| **Cross-Tenant IDOR (CWE-639)** | `DELETE` & `PUT` trusted caller ID without ownership validation. | Dual-condition lookup: `findByIdAndUserEmail(id, email)`. | **✔ HTTP 403 Forbidden** |
| **SQL Injection (CWE-89)** | Raw inputs concatenated into database queries. | Spring Data JPA / Hibernate parameterized prepared statements. | **✔ Fully Parameterized** |
| **Mass Assignment (CWE-915)** | Accepted negative balances and injected administrative roles. | Jakarta Bean Validation (`@Positive`, `@NotBlank`, strict DTOs). | **✔ HTTP 400 Bad Request** |
| **Error Leakage (CWE-209)** | Database driver exceptions and stack traces leaked in HTTP 500. | `@RestControllerAdvice` sanitization returning generic error JSON. | **✔ Zero Stack Leakage** |
| **Session Hijacking (CWE-384)** | Plain tokens stored in localStorage. | Stateless HMAC-SHA256 JWT in `HttpOnly` / `SameSite` cookies + BCrypt (12 rounds). | **✔ Immune to XSS Theft** |

---

## 📈 Deep Financial Analytics & Visualizer Features

- **Ledger Overview Mode**: Real-time Net Balance, active spendings, incomes, and interactive 3D physics credit card with 360° mouse drag.
- **Deep Analytics Visualizer Mode**:
  - **Transaction Count Distribution**: Real-time ratio of Credit cashflows vs. Debit expenses with colored percentage bars.
  - **Gross Turnover & Capital Velocity**: Total gross turnover volume and relative capital velocity.
  - **Category-wise Spending Breakdown**: Dynamic progress visualizers showing exact expenditure percentages per category.
  - **Category-wise Income Allocation**: Real-time allocation bars showing income distribution across consulting, bounties, and salaries.
- **Time Frequency Filtering**: Instant toggle across **All Time**, **Last 7 Days**, **Last 30 Days**, and **Last 1 Year**.
- **In-Dashboard Security Audit Review**: Embedded security matrix with smooth-scrolling triggers and floating quick-jump action buttons.

---

## 🤖 Automated Security Verification (Python 3.10)

The project includes an automated regression test engine located at `python_pentest_suite/audit_tool.py`:

```bash
python python_pentest_suite/audit_tool.py
```

### Execution Output:
```text
====================================================================
 🛡️  FINANCE PLATFORM AUTOMATED SECURITY & PENTEST AUDIT
 Architecture: Java 21 / Spring Boot 3 / Spring Security 6 / React
 Auditor: Parth Pandey (Security Engineer & Full-Stack Developer)
 Target API: http://localhost:8080
====================================================================

[*] TEST-01: Unauthenticated Endpoint Protection (CWE-306)      --> PASS (HTTP 403)
[*] TEST-02: Cryptographic JWT Signature Tampering (CWE-347)      --> PASS (HTTP 403)
[*] TEST-03: Cross-Tenant IDOR Deletion Isolation (CWE-639)       --> PASS (HTTP 403)
[*] TEST-04: SQL Injection Resistance (CWE-89)                    --> PASS (4/4 Payloads Blocked)
[*] TEST-05: Mass Assignment & Strict Schema Validation (CWE-915) --> PASS (HTTP 400)
[*] TEST-06: Security Headers & Information Leakage (CWE-693)     --> PASS (SAMEORIGIN, nosniff)
[*] TEST-07: Cross-Tenant IDOR Modification Isolation (CWE-639)   --> PASS (HTTP 403 on PUT)

====================================================================
AUDIT SUMMARY: 7/7 DEFENSIVE CONTROLS VERIFIED (100% PASS in 1.55s)
✔ 100% SECURITY HARDENING COMPLIANT! Ready to feature on resume.
====================================================================
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java 21 LTS** (`javac -version`)
- **Node.js 18+** & npm
- **Python 3.10+**

### 1. Start the Hardened Spring Boot Backend
```bash
cd backend-java
./mvnw spring-boot:run
```
*Backend runs on `http://localhost:8080` (H2 database console at `/h2-console`).*

### 2. Start the Modern React Frontend
```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

### 3. Run the Automated Security Audit Suite
```bash
python python_pentest_suite/audit_tool.py
```

---

## 📄 Formal Security Documentation
- Complete Markdown Audit Report: [`Finance webapp security report.md`](file:///d:/Parth%20All%20Stuf%20imp/All%20Project/Finance-Management-WebApp-main/Finance%20webapp%20security%20report.md)
- Formal Executive Word Deliverable: [`Finance_Security_Assessment_Report_Parth_Pandey_Integrated.docx`](file:///d:/Parth%20All%20Stuf%20imp/All%20Project/Finance-Management-WebApp-main/Finance_Security_Assessment_Report_Parth_Pandey_Integrated.docx)

---

## 👤 Author
**Parth Pandey**  
- Portfolio / GitHub: [github.com/ParthPandey25](https://github.com/ParthPandey25)  
- Role: Full-Stack Developer & Security Engineer

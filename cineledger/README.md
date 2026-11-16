# CineLedger — Theatrical Box-Office Reconciliation & Cryptographic Audit Engine

> **Every collection accounted for. Every difference explained.**  
> The enterprise platform for theatrical box-office reconciliation, contract-aware revenue settlements, and tamper-evident cryptographic audit transparency.

---

## 📽️ Project Overview

**CineLedger** bridges the financial divide between **Film Studios/Distributors** (e.g. Warner Bros., Reliance Entertainment) and **Theatrical Exhibitor Chains** (e.g. PVR INOX, Cinepolis). In the multi-billion dollar theatrical exhibition industry, box-office collections reported by theater Point-of-Sale (POS) systems frequently diverge from distributor EDI statements due to ticketing gateway fees, tariff category discrepancies, virtual print fees (VPF), and unrecorded customer refunds.

CineLedger automates the three-way ingestion, discrepancy detection, contract terms split calculation, and forensic cryptographic audit tracking.

---

## ⚡ Key Highlights & Architecture

### 1. Dual Ingestion & Automated Reconciliation
- Ingests raw **Theatre POS EDI files** and **Distributor Statements** in standard `.csv` or API batches.
- Line-by-line reconciliation with intelligent matching across `ticket_reference`, show date/time, and screen formats.
- Flags variances: `AMOUNT_MISMATCH`, `MISSING_IN_DISTRIBUTOR`, `RATE_DIFFERENCE`, and `REFUND_INCONSISTENCY`.

### 2. Contract-Aware Revenue Split Engine
- Supports **Net Box Office (NBO)** and **Gross Box Office (GBO)** contractual formulas.
- Precise multi-step financial waterfall:
  1. **Gross Collections** (POS/Gate receipts)
  2. **Statutory Deductions**: Goods & Services Tax (GST, default 18%)
  3. **Platform Deductions**: Ticketing gateway convenience fee (default 2.5%)
  4. **Virtual Print Fee (VPF)**: Fixed show-level projection fee (e.g., ₹500/show)
  5. **Net Distributable Pool**: Split according to contractual shares (e.g., 52.5% Distributor / 47.5% Exhibitor).
- Zero decimal drift with `BigDecimal` arithmetic using `RoundingMode.HALF_UP`.

### 3. Cryptographic SHA-256 Tamper-Evident Audit Chain
- Every critical event (data ingestion, reconciliation run, dispute comment, settlement approval) is chained to the previous block via SHA-256 hashing.
- Canonical payload hashing prevents database record tampering.
- Built-in verification algorithm [`AuditService.verifyAuditChain()`](backend/src/main/java/com/cineledger/service/AuditService.java) scans the chain from genesis and immediately detects breached blocks.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Java 17+, Spring Boot 3.3.4, Spring Data JPA, Spring Security, JJWT 0.12.5 |
| **Persistence** | MySQL 8.0 (Production) / H2 in-memory (Development/Testing) |
| **Frontend** | React 18, Vite 5, React Router 6, Lucide React, Tailwind CSS |
| **Visuals & UX** | Three.js (interactive hero mesh), Canvas Confetti, Framer Motion |
| **Tooling** | Maven Wrapper (`mvnw`), Docker Compose, Postman Collection |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java 17+** (JDK 17 or JDK 21/23)
- **Node.js 18+** & npm
- *(Optional)* **Docker & Docker Compose** for MySQL 8.0

---

### Option A: Launch with One-Click Scripts (Windows)

1. **Start Backend**: Double-click [`run-backend.bat`](run-backend.bat) (Starts on port `8080`)
2. **Start Frontend**: Double-click [`run-frontend.bat`](run-frontend.bat) (Starts on port `5173`)
3. Open **http://localhost:5173** in your web browser.

---

### Option B: Manual Command Line Startup

#### 1. Start the Backend
```bash
cd backend
./mvnw.cmd test-compile
java -cp "$(Get-Content classpath.txt)" com.cineledger.CineLedgerApplication --server.port=8080 --spring.profiles.active=dev
```
*The backend automatically runs [`DataSeeder`](backend/src/main/java/com/cineledger/config/DataSeeder.java) to populate realistic master data, contracts, and demo release titles.*

#### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 👥 Pre-Configured Demonstration Accounts

All accounts use the password: **`Password@123`**

| Email / Username | Role | Organization | Permissions & Purpose |
| :--- | :--- | :--- | :--- |
| `admin@cineledger.io` | **ADMIN** | Warner Bros. Discovery | Full system administration & security policy |
| `analyst@cineledger.io` | **ANALYST** | PVR INOX Limited | Run reconciliations, raise disputes, generate draft settlements |
| `auditor@cineledger.io` | **AUDITOR** | Deloitte Media Assurance | Verify SHA-256 audit chain, sign off payout vouchers |
| `distributor@cineledger.io` | **DISTRIBUTOR** | Warner Bros. Discovery | Upload distributor statements, inspect theatrical terms |
| `exhibitor@cineledger.io` | **EXHIBITOR** | PVR INOX Limited | Review ticket variances, submit POS reports |

> **Note:** The UI features a 1-click **Stakeholder Switcher** in the sidebar footer and the **Team** page to seamlessly toggle between user perspectives.

---

## 📁 Repository Structure

```
cineledger/
├── backend/
│   ├── src/main/java/com/cineledger/
│   │   ├── config/          # SecurityConfig, DataSeeder
│   │   ├── controller/      # 11 REST Controllers (Films, Settlements, Audit, etc.)
│   │   ├── dto/             # Request & Response Data Transfer Objects
│   │   ├── entity/          # 17 JPA Entities (Reconciliation, Contract, Film, Audit, etc.)
│   │   ├── exception/       # GlobalExceptionHandler, Custom HTTP exceptions
│   │   ├── repository/      # 17 Spring Data JPA Repositories
│   │   ├── security/        # JWT Authentication Filter & Token Provider
│   │   └── service/         # Business Logic Engines (Settlement, Audit, Recon)
│   ├── src/test/java/       # SettlementCalculationTest & AuditChainIntegrityTest
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/      # FilmPoster, Hero3D, AppSidebar, AppNavbar, StatCard
│   │   ├── context/         # AuthContext with demo user switcher
│   │   ├── layouts/         # AppLayout (Authenticated) & PublicLayout
│   │   ├── pages/           # 20 Pages (Dashboard, Reconciliations, Settlements, Audit, etc.)
│   │   ├── services/        # Centralized REST API Service (fetch client)
│   │   ├── styles/          # Cinematic Fintech Design Tokens & CSS
│   │   ├── App.jsx          # Master Route Declarations
│   │   └── main.jsx         # React 18 DOM Entry Point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── database/
│   ├── schema.sql           # Complete MySQL 8.0 DDL (10 core tables & indexes)
│   └── seed_data.sql        # Turnkey SQL insert statements
├── postman/
│   └── CineLedger_API.postman_collection.json  # Complete REST API test collection
├── sample-data/
│   ├── theatre_pos_sample.csv                  # Sample POS transactions for testing imports
│   └── distributor_statement_sample.csv        # Sample distributor statement for testing imports
├── docker-compose.yml       # 1-command MySQL 8.0 container setup
├── run-backend.bat          # 1-click backend runner
└── run-frontend.bat         # 1-click frontend runner
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health status & database connectivity | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch currently logged in user profile | Yes |
| `GET` | `/api/dashboard` | Aggregated box office, discrepancies & voucher counts | Yes |
| `GET` | `/api/films` | List theatrical film master records | Yes |
| `POST` | `/api/films` | Register new theatrical release | Yes (Admin/Distributor) |
| `GET` | `/api/cinemas` | List multiplex circuits and screen auditoriums | Yes |
| `GET` | `/api/reconciliations` | List box-office reconciliation runs | Yes |
| `POST` | `/api/reconciliations/{id}/run` | Execute automated line-item variance reconciliation | Yes |
| `POST` | `/api/imports` | Ingest POS or Distributor CSV file | Yes |
| `GET` | `/api/settlements` | List contract revenue settlement vouchers | Yes |
| `POST` | `/api/settlements/{id}/approve` | Approve settlement voucher with payment reference | Yes (Auditor/Admin) |
| `GET` | `/api/disputes` | List variance dispute cases | Yes |
| `POST` | `/api/disputes/{id}/comments` | Post dispute investigation comment | Yes |
| `GET` | `/api/audit?all=true` | Retrieve full cryptographic audit ledger | Yes |
| `GET` | `/api/audit/verify` | Execute SHA-256 hash continuity verification | Yes |
| `POST` | `/api/audit/tamper-test` | Simulate fraudulent modification for testing | Yes |
| `POST` | `/api/audit/restore-chain` | Re-anchor and repair cryptographic signatures | Yes (Admin) |

---

## 🧪 Testing

Execute automated unit and integration tests:

```bash
cd backend
# Run Settlement Calculation precision tests
./mvnw.cmd test -Dtest=SettlementCalculationTest

# Run Cryptographic Hash Chain integrity tests
./mvnw.cmd test -Dtest=AuditChainIntegrityTest
```

---

## 📄 License
© 2026 CineLedger Inc. All rights reserved. Built for theatrical financial assurance and transparent box-office revenue distribution.


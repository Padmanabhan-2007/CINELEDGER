-- ============================================================================
-- CINELEDGER DATABASE SCHEMA (MySQL 8.0+)
-- Enterprise Theatrical Box-Office Financial Reconciliation & Cryptographic Audit
-- ============================================================================

CREATE DATABASE IF NOT EXISTS cineledger CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cineledger;

-- 1. Organizations
CREATE TABLE IF NOT EXISTS organizations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- STUDIO, DISTRIBUTOR, EXHIBITOR_CHAIN, AUDIT_FIRM
    contact_email VARCHAR(255),
    tax_identifier VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- ADMIN, ANALYST, AUDITOR, DISTRIBUTOR, EXHIBITOR
    organization_id BIGINT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. Films
CREATE TABLE IF NOT EXISTS films (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    original_title VARCHAR(255),
    code VARCHAR(50) NOT NULL UNIQUE,
    release_year INT NOT NULL,
    duration_minutes INT,
    language VARCHAR(100),
    rating VARCHAR(20),
    genre VARCHAR(100),
    poster_url VARCHAR(1000) NOT NULL,
    synopsis TEXT,
    distributor_id BIGINT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (distributor_id) REFERENCES organizations(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. Cinemas & Screens
CREATE TABLE IF NOT EXISTS cinemas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    circuit_name VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    screen_count INT DEFAULT 1,
    organization_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS screens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cinema_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    screen_number INT NOT NULL,
    seating_capacity INT NOT NULL,
    sound_system VARCHAR(100),
    projection_type VARCHAR(100),
    FOREIGN KEY (cinema_id) REFERENCES cinemas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Contracts & Term Versions
CREATE TABLE IF NOT EXISTS contracts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_number VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    film_id BIGINT NOT NULL,
    distributor_id BIGINT NOT NULL,
    exhibitor_id BIGINT NOT NULL,
    terms_type VARCHAR(50) DEFAULT 'NET_BOX_OFFICE',
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE CASCADE,
    FOREIGN KEY (distributor_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (exhibitor_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contract_versions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_id BIGINT NOT NULL,
    version_number INT NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    distributor_share_pct DECIMAL(5, 2) NOT NULL,
    exhibitor_share_pct DECIMAL(5, 2) NOT NULL,
    convenience_fee_deduction_pct DECIMAL(5, 2) DEFAULT 0.00,
    vpf_deduction_fixed DECIMAL(12, 2) DEFAULT 0.00,
    tax_deduction_pct DECIMAL(5, 2) DEFAULT 18.00,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Reconciliations
CREATE TABLE IF NOT EXISTS reconciliations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reconciliation_number VARCHAR(100) NOT NULL UNIQUE,
    film_id BIGINT NOT NULL,
    cinema_id BIGINT NOT NULL,
    contract_id BIGINT,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, PENDING_DATA, RECONCILED, DISCREPANCIES_FOUND, SETTLED
    notes TEXT,
    total_pos_amount DECIMAL(15, 2) DEFAULT 0.00,
    total_distributor_amount DECIMAL(15, 2) DEFAULT 0.00,
    total_variance DECIMAL(15, 2) DEFAULT 0.00,
    transaction_count INT DEFAULT 0,
    matched_count INT DEFAULT 0,
    discrepancy_count INT DEFAULT 0,
    created_by_user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (film_id) REFERENCES films(id),
    FOREIGN KEY (cinema_id) REFERENCES cinemas(id),
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7. Source Reports & Ticket Transactions
CREATE TABLE IF NOT EXISTS source_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reconciliation_id BIGINT NOT NULL,
    report_type VARCHAR(50) NOT NULL, -- THEATRE_POS, DISTRIBUTOR_STATEMENT, TICKETING_GATEWAY
    original_file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT,
    record_count INT DEFAULT 0,
    gross_amount DECIMAL(15, 2) DEFAULT 0.00,
    deductions_amount DECIMAL(15, 2) DEFAULT 0.00,
    net_amount DECIMAL(15, 2) DEFAULT 0.00,
    uploaded_by VARCHAR(100),
    status VARCHAR(50) DEFAULT 'PARSED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reconciliation_id) REFERENCES reconciliations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ticket_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_report_id BIGINT NOT NULL,
    reconciliation_id BIGINT NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    ticket_reference VARCHAR(100) NOT NULL,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    screen_name VARCHAR(100),
    format_type VARCHAR(50),
    admissions_count INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    gross_amount DECIMAL(15, 2) NOT NULL,
    tax_amount DECIMAL(15, 2) DEFAULT 0.00,
    discount_amount DECIMAL(15, 2) DEFAULT 0.00,
    net_amount DECIMAL(15, 2) NOT NULL,
    settlement_week INT DEFAULT 1,
    currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_report_id) REFERENCES source_reports(id) ON DELETE CASCADE,
    FOREIGN KEY (reconciliation_id) REFERENCES reconciliations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Discrepancies & Disputes
CREATE TABLE IF NOT EXISTS discrepancies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reconciliation_id BIGINT NOT NULL,
    discrepancy_code VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL, -- AMOUNT_MISMATCH, MISSING_IN_DISTRIBUTOR, MISSING_IN_POS, RATE_DIFFERENCE, REFUND_INCONSISTENCY
    severity VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    description TEXT NOT NULL,
    ticket_reference VARCHAR(100),
    pos_amount DECIMAL(15, 2) DEFAULT 0.00,
    distributor_amount DECIMAL(15, 2) DEFAULT 0.00,
    variance_amount DECIMAL(15, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'OPEN', -- OPEN, UNDER_REVIEW, DISPUTED, RESOLVED, WAIVED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reconciliation_id) REFERENCES reconciliations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS disputes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dispute_number VARCHAR(100) NOT NULL UNIQUE,
    discrepancy_id BIGINT NOT NULL,
    reconciliation_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    disputed_amount DECIMAL(15, 2) NOT NULL,
    proposed_correction DECIMAL(15, 2),
    status VARCHAR(50) DEFAULT 'OPEN', -- OPEN, IN_REVIEW, ACCEPTED, REJECTED, ESCALATED
    opened_by_user_id BIGINT NOT NULL,
    resolved_by_user_id BIGINT,
    resolution_notes TEXT,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (discrepancy_id) REFERENCES discrepancies(id) ON DELETE CASCADE,
    FOREIGN KEY (reconciliation_id) REFERENCES reconciliations(id) ON DELETE CASCADE,
    FOREIGN KEY (opened_by_user_id) REFERENCES users(id),
    FOREIGN KEY (resolved_by_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS dispute_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dispute_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(50) NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS evidence_attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dispute_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT,
    file_type VARCHAR(50),
    storage_path VARCHAR(500) NOT NULL,
    description VARCHAR(500),
    uploaded_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Settlements & Line Items
CREATE TABLE IF NOT EXISTS settlements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    settlement_number VARCHAR(100) NOT NULL UNIQUE,
    reconciliation_id BIGINT NOT NULL,
    contract_id BIGINT NOT NULL,
    contract_version_id BIGINT NOT NULL,
    reporting_period_start DATE NOT NULL,
    reporting_period_end DATE NOT NULL,
    gross_box_office DECIMAL(15, 2) NOT NULL,
    allowable_deductions DECIMAL(15, 2) NOT NULL,
    net_settlement_basis DECIMAL(15, 2) NOT NULL,
    distributor_share_pct DECIMAL(5, 2) NOT NULL,
    distributor_settlement_amount DECIMAL(15, 2) NOT NULL,
    exhibitor_settlement_amount DECIMAL(15, 2) NOT NULL,
    final_payable_amount DECIMAL(15, 2) NOT NULL,
    payable_to VARCHAR(50) DEFAULT 'DISTRIBUTOR',
    status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, PENDING_APPROVAL, APPROVED, PAID, DISPUTED
    payment_reference VARCHAR(100),
    approved_by VARCHAR(100),
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reconciliation_id) REFERENCES reconciliations(id) ON DELETE CASCADE,
    FOREIGN KEY (contract_id) REFERENCES contracts(id),
    FOREIGN KEY (contract_version_id) REFERENCES contract_versions(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS settlement_line_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    settlement_id BIGINT NOT NULL,
    sequence_order INT NOT NULL,
    category VARCHAR(50) NOT NULL, -- GROSS_REVENUE, TAX_DEDUCTION, CONVENIENCE_ADJUSTMENT, VPF_DEDUCTION, NET_SETTLEMENT_BASIS, DISTRIBUTOR_SHARE, EXHIBITOR_SHARE
    description VARCHAR(255) NOT NULL,
    basis_amount DECIMAL(15, 2) NOT NULL,
    rate_or_share DECIMAL(10, 4) NOT NULL,
    line_amount DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (settlement_id) REFERENCES settlements(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Cryptographic SHA-256 Audit Trail
CREATE TABLE IF NOT EXISTS audit_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sequence_number BIGINT NOT NULL UNIQUE,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actor_username VARCHAR(100) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT,
    description TEXT,
    canonical_payload TEXT NOT NULL,
    previous_hash VARCHAR(64) NOT NULL,
    current_hash VARCHAR(64) NOT NULL,
    INDEX idx_audit_seq (sequence_number),
    INDEX idx_audit_actor (actor_username)
) ENGINE=InnoDB;


-- ============================================================================
-- CINELEDGER SEED DATA (MySQL 8.0+)
-- Realistic Theatrical Release, Settlement & Audit Demonstration Data
-- ============================================================================

USE cineledger;

-- 1. Organizations
INSERT INTO organizations (id, name, type, contact_email, tax_identifier) VALUES
(1, 'Warner Bros. Discovery', 'STUDIO', 'boxoffice@wb.com', 'WB-STUDIO'),
(2, 'Reliance Entertainment', 'DISTRIBUTOR', 'theatrical@reliance.com', 'REL-DIST'),
(3, 'PVR INOX Limited', 'EXHIBITOR_CHAIN', 'settlements@pvrinox.com', 'PVR-INOX'),
(4, 'Cinepolis India', 'EXHIBITOR_CHAIN', 'ops@cinepolis.com', 'CINEPOLIS'),
(5, 'Deloitte Media Assurance', 'AUDIT_FIRM', 'audit@deloitte.com', 'DELOITTE');

-- 2. Users (Password: Password@123 -> BCrypt hash)
INSERT INTO users (id, username, email, password_hash, full_name, role, organization_id, active) VALUES
(1, 'admin@cineledger.io', 'admin@cineledger.io', '$2a$10$wN1eK6g9kHqP8rWfF7VqSeN0T8jF8eWlQ3aC9pS5vH7fO9bK8dY2e', 'Alexander Vance (Admin)', 'ADMIN', 1, TRUE),
(2, 'analyst@cineledger.io', 'analyst@cineledger.io', '$2a$10$wN1eK6g9kHqP8rWfF7VqSeN0T8jF8eWlQ3aC9pS5vH7fO9bK8dY2e', 'Priya Sharma (Lead Financial Analyst)', 'ANALYST', 3, TRUE),
(3, 'auditor@cineledger.io', 'auditor@cineledger.io', '$2a$10$wN1eK6g9kHqP8rWfF7VqSeN0T8jF8eWlQ3aC9pS5vH7fO9bK8dY2e', 'Marcus Sterling (Assurance Auditor)', 'AUDITOR', 5, TRUE),
(4, 'distributor@cineledger.io', 'distributor@cineledger.io', '$2a$10$wN1eK6g9kHqP8rWfF7VqSeN0T8jF8eWlQ3aC9pS5vH7fO9bK8dY2e', 'David Chen (WB Distribution VP)', 'DISTRIBUTOR', 1, TRUE),
(5, 'exhibitor@cineledger.io', 'exhibitor@cineledger.io', '$2a$10$wN1eK6g9kHqP8rWfF7VqSeN0T8jF8eWlQ3aC9pS5vH7fO9bK8dY2e', 'Kavita Rao (PVR Exhibition GM)', 'EXHIBITOR', 3, TRUE);

-- 3. Master Films
INSERT INTO films (id, title, original_title, code, release_year, duration_minutes, language, rating, genre, poster_url, synopsis, distributor_id, status) VALUES
(1, 'Oppenheimer: The Manhattan Chronicles', 'Oppenheimer', 'FLM-2026-001', 2023, 180, 'English', 'PG-13', 'Biography / Historical Drama', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop', 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', 1, 'ACTIVE'),
(2, 'Dune: Prophecy of Arrakis', 'Dune: Part Two', 'FLM-2026-002', 2024, 166, 'English', 'PG-13', 'Sci-Fi / Epic Adventure', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop', 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', 1, 'ACTIVE'),
(3, 'The Dark Knight: Gotham Reckoning', 'The Dark Knight', 'FLM-2026-003', 2024, 152, 'English', 'PG-13', 'Action / Neo-Noir Thriller', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', 1, 'ACTIVE'),
(4, 'Interstellar: Beyond the Horizon', 'Interstellar', 'FLM-2026-004', 2025, 169, 'English', 'PG-13', 'Sci-Fi / Space Mystery', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.', 1, 'ACTIVE'),
(5, 'Neon Velvet: Bombay Nights', 'Neon Velvet', 'FLM-2026-005', 2026, 138, 'Hindi', 'U/A', 'Neo-Noir Crime Thriller', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop', 'In the neon-soaked labyrinth of retro-futuristic Bombay, an undercover detective uncovers a massive syndicate manipulating box-office revenues.', 2, 'ACTIVE'),
(6, 'The Quantum Paradox', 'Quantum Paradox', 'FLM-2026-006', 2026, 145, 'English', 'PG-13', 'Action / Mind-Bender', 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop', 'A theoretical physicist invents an entanglement device that splits temporal outcomes.', 1, 'ACTIVE');

-- 4. Cinemas & Screens
INSERT INTO cinemas (id, name, code, circuit_name, city, state, country, screen_count, organization_id) VALUES
(1, 'PVR ICON Phoenix Palladium', 'CIN-MUM-01', 'PVR INOX', 'Mumbai', 'Maharashtra', 'India', 7, 3),
(2, 'INOX Megaplex Inorbit Mall', 'CIN-MUM-02', 'PVR INOX', 'Mumbai', 'Maharashtra', 'India', 11, 3),
(3, 'PVR Director''s Cut Ambience Mall', 'CIN-DEL-01', 'PVR INOX', 'New Delhi', 'Delhi', 'India', 5, 3),
(4, 'Cinepolis Nexus Forum Mall', 'CIN-BLR-01', 'Cinepolis', 'Bengaluru', 'Karnataka', 'India', 8, 4);

INSERT INTO screens (cinema_id, name, screen_number, seating_capacity, sound_system, projection_type) VALUES
(1, 'Screen 1 (IMAX Laser)', 1, 280, 'Dolby Atmos 12-Channel', 'IMAX 4K Dual Laser'),
(1, 'Screen 2', 2, 220, 'Dolby Surround 7.1', '4K Laser'),
(1, 'Screen 3', 3, 180, 'Dolby Surround 7.1', '4K Laser'),
(2, 'Screen 1', 1, 310, 'Dolby Atmos', 'Barco 4K Laser'),
(3, 'Lounge 1', 1, 120, 'Dolby Atmos', 'Christie 4K RGB Laser'),
(4, 'Screen 1', 1, 240, 'Dolby 7.1', 'Laser 2K');

-- 5. Contracts & Versions
INSERT INTO contracts (id, contract_number, title, film_id, distributor_id, exhibitor_id, terms_type, status) VALUES
(1, 'CTR-2026-WB-PVR-001', 'Oppenheimer Theatrical Exhibition Master Agreement', 1, 1, 3, 'NET_BOX_OFFICE', 'ACTIVE'),
(2, 'CTR-2026-WB-PVR-002', 'Dune Part Two Exhibition Agreement', 2, 1, 3, 'GROSS_BOX_OFFICE', 'ACTIVE'),
(3, 'CTR-2026-WB-CIN-003', 'The Dark Knight Exhibition Re-release Agreement', 3, 1, 4, 'NET_BOX_OFFICE', 'ACTIVE');

INSERT INTO contract_versions (id, contract_id, version_number, effective_from, distributor_share_pct, exhibitor_share_pct, convenience_fee_deduction_pct, vpf_deduction_fixed, tax_deduction_pct, notes, is_active) VALUES
(1, 1, 1, '2023-07-01', 52.50, 47.50, 2.50, 500.00, 18.00, 'Standard tier-1 multiplex theatrical exhibition agreement with 52.5/47.5 net split.', TRUE),
(2, 2, 1, '2024-03-01', 50.00, 50.00, 0.00, 0.00, 18.00, 'Gross box office split agreement with 50/50 revenue share.', TRUE),
(3, 3, 1, '2024-06-01', 45.00, 55.00, 2.00, 300.00, 18.00, 'Summer festival re-release agreement with 45% distributor share.', TRUE);

-- 6. Initial Audit Genesis Block
INSERT INTO audit_events (sequence_number, timestamp, actor_username, actor_role, event_type, entity_type, entity_id, description, canonical_payload, previous_hash, current_hash) VALUES
(1, CURRENT_TIMESTAMP, 'system', 'SYSTEM', 'SYSTEM_INITIALIZED', 'SYSTEM', 0, 'CineLedger root security and organizations initialized', '1|2026-10-23T08:00:00|system|SYSTEM|SYSTEM_INITIALIZED|SYSTEM|0|CineLedger root security and organizations initialized', '0000000000000000000000000000000000000000000000000000000000000000', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');


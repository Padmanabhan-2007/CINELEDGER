package com.cineledger.config;

import com.cineledger.entity.*;
import com.cineledger.repository.*;
import com.cineledger.service.AuditService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final FilmRepository filmRepository;
    private final CinemaRepository cinemaRepository;
    private final ScreenRepository screenRepository;
    private final ContractRepository contractRepository;
    private final ContractVersionRepository contractVersionRepository;
    private final ReconciliationRepository reconciliationRepository;
    private final SourceReportRepository sourceReportRepository;
    private final TicketTransactionRepository ticketTransactionRepository;
    private final DiscrepancyRepository discrepancyRepository;
    private final SettlementRepository settlementRepository;
    private final SettlementLineItemRepository lineItemRepository;
    private final DisputeRepository disputeRepository;
    private final DisputeCommentRepository disputeCommentRepository;
    private final EvidenceAttachmentRepository evidenceAttachmentRepository;
    private final AuditService auditService;
    private final PasswordEncoder passwordEncoder;

    // Cinemaholic 2.0 Repositories
    private final MovieShowtimeRepository movieShowtimeRepository;
    private final AuditoriumLayoutRepository auditoriumLayoutRepository;
    private final AuditoriumSeatRepository auditoriumSeatRepository;
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final MovieReviewRepository movieReviewRepository;
    private final WatchlistRepository watchlistRepository;
    private final CinemaholicUserRepository cinemaholicUserRepository;
    private final IndustryUserRepository industryUserRepository;

    public DataSeeder(UserRepository userRepository,
                      OrganizationRepository organizationRepository,
                      FilmRepository filmRepository,
                      CinemaRepository cinemaRepository,
                      ScreenRepository screenRepository,
                      ContractRepository contractRepository,
                      ContractVersionRepository contractVersionRepository,
                      ReconciliationRepository reconciliationRepository,
                      SourceReportRepository sourceReportRepository,
                      TicketTransactionRepository ticketTransactionRepository,
                      DiscrepancyRepository discrepancyRepository,
                      SettlementRepository settlementRepository,
                      SettlementLineItemRepository lineItemRepository,
                      DisputeRepository disputeRepository,
                      DisputeCommentRepository disputeCommentRepository,
                      EvidenceAttachmentRepository evidenceAttachmentRepository,
                      AuditService auditService,
                      PasswordEncoder passwordEncoder,
                      MovieShowtimeRepository movieShowtimeRepository,
                      AuditoriumLayoutRepository auditoriumLayoutRepository,
                      AuditoriumSeatRepository auditoriumSeatRepository,
                      BookingRepository bookingRepository,
                      BookingSeatRepository bookingSeatRepository,
                      MovieReviewRepository movieReviewRepository,
                      WatchlistRepository watchlistRepository,
                      CinemaholicUserRepository cinemaholicUserRepository,
                      IndustryUserRepository industryUserRepository) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.filmRepository = filmRepository;
        this.cinemaRepository = cinemaRepository;
        this.screenRepository = screenRepository;
        this.contractRepository = contractRepository;
        this.contractVersionRepository = contractVersionRepository;
        this.reconciliationRepository = reconciliationRepository;
        this.sourceReportRepository = sourceReportRepository;
        this.ticketTransactionRepository = ticketTransactionRepository;
        this.discrepancyRepository = discrepancyRepository;
        this.settlementRepository = settlementRepository;
        this.lineItemRepository = lineItemRepository;
        this.disputeRepository = disputeRepository;
        this.disputeCommentRepository = disputeCommentRepository;
        this.evidenceAttachmentRepository = evidenceAttachmentRepository;
        this.auditService = auditService;
        this.passwordEncoder = passwordEncoder;
        this.movieShowtimeRepository = movieShowtimeRepository;
        this.auditoriumLayoutRepository = auditoriumLayoutRepository;
        this.auditoriumSeatRepository = auditoriumSeatRepository;
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.movieReviewRepository = movieReviewRepository;
        this.watchlistRepository = watchlistRepository;
        this.cinemaholicUserRepository = cinemaholicUserRepository;
        this.industryUserRepository = industryUserRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedInitialIndustryData();
        }
        seedCinemaholicData();
    }

    private void seedInitialIndustryData() {
        // 1. Seed Organizations
        Organization wb = organizationRepository.save(new Organization("Warner Bros. Discovery", "STUDIO", "boxoffice@wb.com", "WB-STUDIO"));
        Organization reliance = organizationRepository.save(new Organization("Reliance Entertainment", "DISTRIBUTOR", "theatrical@reliance.com", "REL-DIST"));
        Organization pvr = organizationRepository.save(new Organization("PVR INOX Limited", "EXHIBITOR_CHAIN", "settlements@pvrinox.com", "PVR-INOX"));
        Organization cinepolis = organizationRepository.save(new Organization("Cinepolis India", "EXHIBITOR_CHAIN", "ops@cinepolis.com", "CINEPOLIS"));
        Organization auditFirm = organizationRepository.save(new Organization("Deloitte Media Assurance", "AUDIT_FIRM", "audit@deloitte.com", "DELOITTE"));

        // 2. Seed Base Security Users and Dedicated Industry Users Table
        String defaultHash = passwordEncoder.encode("Password@123");
        User admin = userRepository.save(new User("admin@cineledger.io", "admin@cineledger.io", defaultHash, "Alexander Vance", "ADMIN", wb.getId()));
        User analyst = userRepository.save(new User("analyst@cineledger.io", "analyst@cineledger.io", defaultHash, "Priya Sharma", "ANALYST", pvr.getId()));
        User auditor = userRepository.save(new User("auditor@cineledger.io", "auditor@cineledger.io", defaultHash, "Marcus Sterling", "AUDITOR", auditFirm.getId()));
        User distRep = userRepository.save(new User("distributor@cineledger.io", "distributor@cineledger.io", defaultHash, "David Chen", "DISTRIBUTOR", wb.getId()));
        User exhibRep = userRepository.save(new User("exhibitor@cineledger.io", "exhibitor@cineledger.io", defaultHash, "Kavita Rao", "EXHIBITOR", pvr.getId()));

        // Dedicated industry_users table
        industryUserRepository.save(new IndustryUser("admin@cineledger.io", "Alexander Vance", defaultHash, "ADMIN", wb.getId(), wb.getName(), "VP Theatrical Operations"));
        industryUserRepository.save(new IndustryUser("analyst@cineledger.io", "Priya Sharma", defaultHash, "ANALYST", pvr.getId(), pvr.getName(), "Lead Financial Reconciliation Analyst"));
        industryUserRepository.save(new IndustryUser("auditor@cineledger.io", "Marcus Sterling", defaultHash, "AUDITOR", auditFirm.getId(), auditFirm.getName(), "Senior Assurance Auditor"));
        industryUserRepository.save(new IndustryUser("distributor@cineledger.io", "David Chen", defaultHash, "DISTRIBUTOR", wb.getId(), wb.getName(), "Head of Theatrical Distribution"));
        industryUserRepository.save(new IndustryUser("exhibitor@cineledger.io", "Kavita Rao", defaultHash, "EXHIBITOR", pvr.getId(), pvr.getName(), "General Manager Exhibition Programming"));

        auditService.recordEvent("system", "SYSTEM", "SYSTEM_INITIALIZED", "SYSTEM", 0L, "CineLedger root security and organizations initialized");

        // 3. Seed Centralized Films with Consistent Local & Remote Poster References
        Film oppenheimer = filmRepository.save(new Film(
                "Oppenheimer",
                "Oppenheimer",
                "FLM-2026-001",
                2023,
                180,
                "English",
                "R",
                "Biography / Historical Drama",
                "/assets/posters/oppenheimer.png",
                "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb, recounting complex theatrical box office performance across global IMAX screens.",
                wb.getId(),
                "ACTIVE"
        ));

        Film dune = filmRepository.save(new Film(
                "Dune: Part Two",
                "Dune: Part Two",
                "FLM-2026-002",
                2024,
                166,
                "English",
                "PG-13",
                "Sci-Fi / Epic Adventure",
                "/assets/posters/dune-part-two.png",
                "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, achieving historic weekend opening box office grosses.",
                wb.getId(),
                "ACTIVE"
        ));

        Film darkKnight = filmRepository.save(new Film(
                "The Dark Knight",
                "The Dark Knight",
                "FLM-2026-003",
                2008,
                152,
                "English",
                "PG-13",
                "Action / Neo-Noir Thriller",
                "/assets/posters/the-dark-knight.png",
                "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
                wb.getId(),
                "ACTIVE"
        ));

        Film interstellar = filmRepository.save(new Film(
                "Interstellar",
                "Interstellar",
                "FLM-2026-004",
                2014,
                169,
                "English",
                "PG-13",
                "Sci-Fi / Space Mystery",
                "/assets/posters/interstellar.png",
                "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival, generating evergreen re-release theatrical revenues.",
                wb.getId(),
                "ACTIVE"
        ));

        Film inception = filmRepository.save(new Film(
                "Inception",
                "Inception",
                "FLM-2026-005",
                2010,
                148,
                "English",
                "PG-13",
                "Sci-Fi / Heist Thriller",
                "/assets/posters/inception.png",
                "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
                wb.getId(),
                "ACTIVE"
        ));

        Film bladeRunner = filmRepository.save(new Film(
                "Blade Runner 2049",
                "Blade Runner 2049",
                "FLM-2026-006",
                2017,
                164,
                "English",
                "R",
                "Sci-Fi / Neo-Noir Mystery",
                "/assets/posters/blade-runner-2049.png",
                "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, missing for thirty years.",
                wb.getId(),
                "ACTIVE"
        ));

        auditService.recordEvent(admin.getUsername(), admin.getRole(), "FILMS_SEEDED", "CATALOG", 6L,
                "Seeded master films with persistent authorized poster references");

        // 4. Seed Cinemas & Screens
        Cinema pvrPhoenix = cinemaRepository.save(new Cinema(
                "PVR ICON Phoenix Palladium", "CIN-MUM-01", "PVR INOX", "Mumbai", "Maharashtra", "India", 7, pvr.getId()
        ));
        for (int i = 1; i <= 7; i++) {
            String name = (i == 1) ? "Screen 1 (IMAX Laser)" : "Screen " + i;
            String sound = (i == 1) ? "Dolby Atmos 12-Channel" : "Dolby Surround 7.1";
            screenRepository.save(new Screen(pvrPhoenix.getId(), name, i, 280, sound, (i == 1) ? "IMAX 4K Dual Laser" : "4K Laser"));
        }

        Cinema inoxMalad = cinemaRepository.save(new Cinema(
                "INOX Megaplex Inorbit Mall", "CIN-MUM-02", "PVR INOX", "Mumbai", "Maharashtra", "India", 11, pvr.getId()
        ));
        for (int i = 1; i <= 5; i++) {
            screenRepository.save(new Screen(inoxMalad.getId(), "Screen " + i, i, 220, "Dolby Atmos", "Barco 4K Laser"));
        }

        Cinema pvrAmbience = cinemaRepository.save(new Cinema(
                "PVR Director's Cut Ambience Mall", "CIN-DEL-01", "PVR INOX", "New Delhi", "Delhi", "India", 5, pvr.getId()
        ));
        for (int i = 1; i <= 5; i++) {
            screenRepository.save(new Screen(pvrAmbience.getId(), "Lounge " + i, i, 120, "Dolby Atmos", "Christie 4K RGB Laser"));
        }

        Cinema cinepolisBlr = cinemaRepository.save(new Cinema(
                "Cinepolis Nexus Forum Mall", "CIN-BLR-01", "Cinepolis", "Bengaluru", "Karnataka", "India", 8, cinepolis.getId()
        ));
        for (int i = 1; i <= 6; i++) {
            screenRepository.save(new Screen(cinepolisBlr.getId(), "Screen " + i, i, 240, "Dolby 7.1", "Laser 2K"));
        }

        // 5. Seed Contracts & Effective Terms
        Contract contractOppenheimer = contractRepository.save(new Contract(
                "CTR-2026-WB-PVR-001",
                "Oppenheimer Theatrical Exhibition Master Agreement",
                oppenheimer.getId(),
                wb.getId(),
                pvr.getId(),
                "NET_BOX_OFFICE",
                "ACTIVE"
        ));
        ContractVersion oppVersion1 = contractVersionRepository.save(new ContractVersion(
                contractOppenheimer.getId(),
                1,
                LocalDate.of(2023, 7, 1),
                null,
                new BigDecimal("52.50"), // 52.5% distributor share
                new BigDecimal("47.50"), // 47.5% exhibitor share
                new BigDecimal("2.50"),  // 2.5% convenience fee deduction
                new BigDecimal("500.00"),// ₹500 VPF per show
                new BigDecimal("18.00"), // 18% GST deduction
                "Standard tier-1 multiplex theatrical exhibition agreement. Deductions applied on gross collections prior to 52.5/47.5 net split.",
                true
        ));

        Contract contractDune = contractRepository.save(new Contract(
                "CTR-2026-WB-PVR-002",
                "Dune Part Two Exhibition Agreement",
                dune.getId(),
                wb.getId(),
                pvr.getId(),
                "GROSS_BOX_OFFICE",
                "ACTIVE"
        ));
        ContractVersion duneVersion1 = contractVersionRepository.save(new ContractVersion(
                contractDune.getId(),
                1,
                LocalDate.of(2024, 3, 1),
                null,
                new BigDecimal("50.00"),
                new BigDecimal("50.00"),
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                "Gross box office split agreement without intermediary deductions.",
                true
        ));

        Contract contractDarkKnight = contractRepository.save(new Contract(
                "CTR-2026-WB-CIN-003",
                "The Dark Knight Classic Re-Release License",
                darkKnight.getId(),
                wb.getId(),
                cinepolis.getId(),
                "NET_BOX_OFFICE",
                "ACTIVE"
        ));
        contractVersionRepository.save(new ContractVersion(
                contractDarkKnight.getId(),
                1,
                LocalDate.of(2024, 1, 1),
                null,
                new BigDecimal("45.00"),
                new BigDecimal("55.00"),
                new BigDecimal("2.00"),
                new BigDecimal("350.00"),
                new BigDecimal("18.00"),
                "Re-release split with 55% exhibitor retention incentive.",
                true
        ));

        // 6. Seed Reconciliation 1: Oppenheimer (Disputed)
        Reconciliation rec1 = reconciliationRepository.save(new Reconciliation(
                "REC-2026-001",
                oppenheimer.getId(),
                pvrPhoenix.getId(),
                contractOppenheimer.getId(),
                LocalDate.of(2026, 10, 1),
                LocalDate.of(2026, 10, 7),
                "DISPUTED",
                "Discrepancy detected in online portal ticket counts vs. physical turns.",
                analyst.getId()
        ));

        SourceReport repDistributor = sourceReportRepository.save(new SourceReport(
                rec1.getId(),
                "DISTRIBUTOR_EDI",
                "WarnerBros-EDI-Wk41-PVR.xml",
                1420,
                new BigDecimal("685000.00"),
                "{\"feed\": \"WB_GLOBAL_EDI\", \"status\": \"PROCESSED\", \"totalShows\": 28}"
        ));

        SourceReport repExhibitor = sourceReportRepository.save(new SourceReport(
                rec1.getId(),
                "EXHIBITOR_POS",
                "PVR-Phoenix-POS-Export-Wk41.csv",
                1385,
                new BigDecimal("668000.00"),
                "{\"system\": \"VISTA_CINEMA_POS\", \"batchId\": \"PVR-41092\", \"status\": \"VERIFIED\"}"
        ));

        discrepancyRepository.save(new Discrepancy(
                rec1.getId(),
                "ADMISSION_COUNT_MISMATCH",
                "HIGH",
                "Distributor EDI reported 1,420 admissions, while Exhibitor POS registered 1,385 admissions. Net shortfall: 35 tickets.",
                "35 tickets",
                new BigDecimal("17000.00"),
                "OPEN"
        ));

        Dispute dispute1 = disputeRepository.save(new Dispute(
                "DSP-2026-001",
                rec1.getId(),
                contractOppenheimer.getId(),
                "ADMISSION_SHORTFALL",
                "OPEN",
                "Distributor claims 35 unpaid IMAX admissions totaling ₹17,000 across weekend evening showtimes at Screen 1.",
                new BigDecimal("17000.00"),
                distRep.getId(),
                exhibRep.getId()
        ));

        disputeCommentRepository.save(new DisputeComment(
                dispute1.getId(),
                distRep.getId(),
                "Our third-party BookMyShow API sync recorded 35 successful transactions that are not reflected in PVR's settlement ledger.",
                "DISTRIBUTOR"
        ));

        evidenceAttachmentRepository.save(new EvidenceAttachment(
                dispute1.getId(),
                distRep.getId(),
                "BMS_Transaction_Audit_Log_Oct03_04.pdf",
                "/mock-storage/evidence/BMS_Log_Oct03.pdf",
                "application/pdf",
                142850L
        ));

        auditService.recordEvent(analyst.getUsername(), analyst.getRole(), "RECONCILIATION_RUN", "RECONCILIATION", rec1.getId(),
                "Automated ingestion reconciliation REC-2026-001 run. Status: DISPUTED with 1 high discrepancy.");

        // 7. Seed Reconciliation 2: Dune Part Two (Settled)
        Reconciliation rec2 = reconciliationRepository.save(new Reconciliation(
                "REC-2026-002",
                dune.getId(),
                inoxMalad.getId(),
                contractDune.getId(),
                LocalDate.of(2026, 10, 8),
                LocalDate.of(2026, 10, 14),
                "SETTLED",
                "Fully verified weekend box-office collections matched with zero discrepancies.",
                analyst.getId()
        ));

        Settlement stl2 = new Settlement();
        stl2.setSettlementNumber("STL-2026-002");
        stl2.setReconciliationId(rec2.getId());
        stl2.setContractId(contractDune.getId());
        stl2.setContractVersionId(duneVersion1.getId());
        stl2.setReportingPeriodStart(rec2.getPeriodStart());
        stl2.setReportingPeriodEnd(rec2.getPeriodEnd());
        stl2.setGrossBoxOffice(new BigDecimal("620000.00"));
        stl2.setAllowableDeductions(BigDecimal.ZERO);
        stl2.setNetSettlementBasis(new BigDecimal("620000.00"));
        stl2.setDistributorSharePct(new BigDecimal("50.00"));
        stl2.setDistributorSettlementAmount(new BigDecimal("310000.00"));
        stl2.setExhibitorSettlementAmount(new BigDecimal("310000.00"));
        stl2.setFinalPayableAmount(new BigDecimal("310000.00"));
        stl2.setPayableTo("DISTRIBUTOR");
        stl2.setStatus("APPROVED");
        stl2.setApprovedBy(auditor.getUsername());
        stl2.setApprovedAt(LocalDateTime.now().minusDays(1));
        stl2.setPaymentReference("HDFC-RTGS-89210741");
        Settlement savedStl2 = settlementRepository.save(stl2);

        lineItemRepository.save(new SettlementLineItem(savedStl2.getId(), 1, "GROSS_REVENUE", "Gross Collections (Matched)", new BigDecimal("620000.00"), BigDecimal.ONE, new BigDecimal("620000.00")));
        lineItemRepository.save(new SettlementLineItem(savedStl2.getId(), 2, "NET_SETTLEMENT_BASIS", "Net Settlement Basis (Gross)", new BigDecimal("620000.00"), BigDecimal.ONE, new BigDecimal("620000.00")));
        lineItemRepository.save(new SettlementLineItem(savedStl2.getId(), 3, "DISTRIBUTOR_SHARE", "Distributor Share (50.00%)", new BigDecimal("620000.00"), new BigDecimal("50.00"), new BigDecimal("310000.00")));
        lineItemRepository.save(new SettlementLineItem(savedStl2.getId(), 4, "EXHIBITOR_SHARE", "Exhibitor Retention (50.00%)", new BigDecimal("620000.00"), new BigDecimal("50.00"), new BigDecimal("310000.00")));

        auditService.recordEvent(auditor.getUsername(), auditor.getRole(), "SETTLEMENT_APPROVED", "SETTLEMENT", savedStl2.getId(),
                "Settlement STL-2026-002 approved for payment of ₹310,000.00 (Ref: HDFC-RTGS-89210741)");

        // 8. Seed Reconciliation 3: The Dark Knight (Draft)
        reconciliationRepository.save(new Reconciliation(
                "REC-2026-003",
                darkKnight.getId(),
                cinepolisBlr.getId(),
                contractDarkKnight.getId(),
                LocalDate.of(2026, 10, 15),
                LocalDate.of(2026, 10, 22),
                "DRAFT",
                "Awaiting distributor EDI data feed for Dark Knight re-run.",
                analyst.getId()
        ));

        auditService.recordEvent(analyst.getUsername(), analyst.getRole(), "SEED_DATA_COMPLETE", "SYSTEM", 0L,
                "Seeded complete realistic financial demonstration dataset with intact cryptographic SHA-256 chain");
    }

    private void seedCinemaholicData() {
        // Step 1: Ensure Dedicated cinemaholic_users Table is seeded
        String defaultHash = passwordEncoder.encode("Password@123");
        User audienceUser = userRepository.findByEmail("audience@cinemaholic.com").orElseGet(() -> {
            User u = new User("audience@cinemaholic.com", "audience@cinemaholic.com", defaultHash, "Aarav Sharma", "ROLE_AUDIENCE", null);
            return userRepository.save(u);
        });

        if (cinemaholicUserRepository.count() == 0) {
            cinemaholicUserRepository.save(new CinemaholicUser("audience@cinemaholic.com", "Aarav Sharma", "+91 98765 43210", defaultHash, "VIP Premiere Club", "IMAX 4K Dual Laser", 850, "Mumbai"));
            cinemaholicUserRepository.save(new CinemaholicUser("rohan.verma@cinemaholic.com", "Rohan Verma", "+91 98201 54321", defaultHash, "Gold Class Recliner Club", "Dolby Atmos 64ch", 620, "Bengaluru"));
            cinemaholicUserRepository.save(new CinemaholicUser("priya.k@cinemaholic.com", "Priya K.", "+91 97112 34567", defaultHash, "Director's Cut Royale", "VIP Lounge Recliner", 480, "New Delhi"));
            cinemaholicUserRepository.save(new CinemaholicUser("ananya.d@cinemaholic.com", "Ananya D.", "+91 99401 23890", defaultHash, "IMAX Laser Enthusiast", "IMAX 4K Dual Laser", 390, "Mumbai"));
            cinemaholicUserRepository.save(new CinemaholicUser("kabir.m@cinemaholic.com", "Kabir Mehta", "+91 98334 11223", defaultHash, "Cinephile Circle", "4DX Dynamic Motion", 250, "Mumbai"));
        }

        // Step 2: Ensure all 20 Master Films are present
        seedRemainingFilms();

        // Step 3: Seed Screen 1 & Screen 2 Auditorium Layout & 3D Spatial Seats
        seedAuditoriumLayoutsAndSeats();

        // Step 4: Seed Showtimes
        seedShowtimes();

        // Step 5: Seed Community 5-Tier Reviews
        seedMovieReviews(audienceUser);

        // Step 6: Seed Initial Sample Bookings for Audience User
        seedSampleBookings(audienceUser);

        // Step 7: Seed Watchlist
        seedWatchlist(audienceUser);
    }

    private void seedRemainingFilms() {
        Long defaultDistId = organizationRepository.findAll().stream().findFirst().map(Organization::getId).orElse(1L);

        List<Film> additionalFilms = List.of(
                new Film("Tenet", "Tenet", "FLM-2026-007", 2020, 150, "English", "PG-13", "Action / Sci-Fi", "/assets/posters/tenet.png", "Armed with only one word, Tenet, and fighting for the survival of the entire world, a Protagonist journeys through a twilight world of international espionage.", defaultDistId, "ACTIVE"),
                new Film("The Matrix", "The Matrix", "FLM-2026-008", 1999, 136, "English", "R", "Action / Sci-Fi", "/assets/posters/the-matrix.png", "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.", defaultDistId, "ACTIVE"),
                new Film("Top Gun: Maverick", "Top Gun: Maverick", "FLM-2026-009", 2022, 130, "English", "PG-13", "Action / Drama", "/assets/posters/top-gun-maverick.png", "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates.", defaultDistId, "ACTIVE"),
                new Film("The Batman", "The Batman", "FLM-2026-010", 2022, 176, "English", "PG-13", "Action / Crime / Drama", "/assets/posters/the-batman.png", "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.", defaultDistId, "ACTIVE"),
                new Film("Joker", "Joker", "FLM-2026-011", 2019, 122, "English", "R", "Crime / Drama / Thriller", "/assets/posters/joker.png", "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic crime figure.", defaultDistId, "ACTIVE"),
                new Film("Avengers: Endgame", "Avengers: Endgame", "FLM-2026-012", 2019, 181, "English", "PG-13", "Action / Sci-Fi", "/assets/posters/avengers-endgame.png", "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.", defaultDistId, "ACTIVE"),
                new Film("Avatar: The Way of Water", "Avatar: The Way of Water", "FLM-2026-013", 2022, 192, "English", "PG-13", "Sci-Fi / Adventure", "/assets/posters/avatar.png", "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri.", defaultDistId, "ACTIVE"),
                new Film("John Wick: Chapter 4", "John Wick: Chapter 4", "FLM-2026-014", 2023, 169, "English", "R", "Action / Crime / Thriller", "/assets/posters/john-wick.png", "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe.", defaultDistId, "ACTIVE"),
                new Film("Mad Max: Fury Road", "Mad Max: Fury Road", "FLM-2026-015", 2015, 120, "English", "R", "Action / Sci-Fi", "/assets/posters/mad-max-fury-road.png", "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper and an ex-drifter named Max.", defaultDistId, "ACTIVE"),
                new Film("Spider-Man: Across the Spider-Verse", "Spider-Man: Across the Spider-Verse", "FLM-2026-016", 2023, 140, "English", "PG", "Animation / Action / Adventure", "/assets/posters/spider-man.png", "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.", defaultDistId, "ACTIVE"),
                new Film("Mission: Impossible - Dead Reckoning", "Mission: Impossible - Dead Reckoning", "FLM-2026-017", 2023, 163, "English", "PG-13", "Action / Adventure / Thriller", "/assets/posters/mission-impossible.png", "Ethan Hunt and his IMF team must track down a dangerous weapon before it falls into the wrong hands.", defaultDistId, "ACTIVE"),
                new Film("Doctor Strange in the Multiverse of Madness", "Doctor Strange", "FLM-2026-018", 2022, 126, "English", "PG-13", "Action / Fantasy / Sci-Fi", "/assets/posters/doctor-strange.png", "Doctor Strange teams up with a mysterious teenage girl from his dreams who can travel across multiverses, to battle multiple threats.", defaultDistId, "ACTIVE"),
                new Film("Guardians of the Galaxy Vol. 3", "Guardians of the Galaxy", "FLM-2026-019", 2023, 150, "English", "PG-13", "Action / Sci-Fi", "/assets/posters/guardians-of-the-galaxy.png", "Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe and one of their own.", defaultDistId, "ACTIVE"),
                new Film("Dune", "Dune: Part One", "FLM-2026-020", 2021, 155, "English", "PG-13", "Sci-Fi / Adventure", "/assets/posters/dune.png", "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.", defaultDistId, "ACTIVE")
        );

        for (Film film : additionalFilms) {
            if (filmRepository.findByCode(film.getCode()).isEmpty()) {
                filmRepository.save(film);
            }
        }
    }

    private void seedAuditoriumLayoutsAndSeats() {
        List<Screen> screens = screenRepository.findAll();
        for (Screen screen : screens) {
            Optional<AuditoriumLayout> optLayout = auditoriumLayoutRepository.findByScreenId(screen.getId());
            if (optLayout.isEmpty() || optLayout.get().getTotalRows() < 14) {
                optLayout.ifPresent(auditoriumLayoutRepository::delete);
                AuditoriumLayout layout = new AuditoriumLayout(
                        screen.getId(),
                        "IMAX 4K Laser Grand Stadium (252 Seats)",
                        14,
                        18,
                        20.0,
                        10.0,
                        28.0,
                        16.0
                );
                auditoriumLayoutRepository.save(layout);
            }

            List<AuditoriumSeat> existingSeats = auditoriumSeatRepository.findByScreenId(screen.getId());
            if (existingSeats.size() < 200) {
                if (!existingSeats.isEmpty()) {
                    auditoriumSeatRepository.deleteAll(existingSeats);
                }

                List<AuditoriumSeat> seats = new ArrayList<>();
                // 14 Stadium Tiers: A through P (omitting I and O as standard in cinema halls)
                char[] rowLabels = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P'};

                for (int r = 0; r < rowLabels.length; r++) {
                    String rowLabel = String.valueOf(rowLabels[r]);
                    String tier;
                    BigDecimal price;

                    if (r < 4) {
                        tier = "CLASSIC";
                        price = new BigDecimal("280.00");
                    } else if (r < 11) {
                        tier = "PRIME";
                        price = new BigDecimal("380.00");
                    } else {
                        tier = "RECLINER";
                        price = new BigDecimal("550.00");
                    }

                    // Physical 3D Z and Y coordinates for elevated stadium seating
                    double posZ = 2.0 + (r * 1.25);
                    double posY = r * 0.38;
                    double eyeHeightY = 1.22;

                    // 18 Seats per row across 3 architectural blocks (Left Wing: 1-4, Center: 5-14, Right Wing: 15-18)
                    for (int c = 1; c <= 18; c++) {
                        String seatCode = rowLabel + c;
                        double posX;
                        if (c <= 4) {
                            posX = -5.8 - (4 - c) * 0.95; // Left Wing (-8.65m to -5.80m)
                        } else if (c <= 14) {
                            posX = (c - 9.5) * 0.92;      // Center Grand Tier (-4.14m to +4.14m)
                        } else {
                            posX = 5.8 + (c - 15) * 0.95; // Right Wing (+5.80m to +8.65m)
                        }

                        // Relative angle and distance to screen center at (0, 4.2, -8.5)
                        double deltaZ = posZ - (-8.5);
                        double deltaY = (posY + eyeHeightY) - 4.2;
                        double viewAngleDeg = Math.toDegrees(Math.atan2(posX, deltaZ));
                        double distanceMeters = Math.sqrt(posX * posX + deltaZ * deltaZ + deltaY * deltaY);

                        AuditoriumSeat seat = new AuditoriumSeat(
                                screen.getId(),
                                rowLabel,
                                c,
                                seatCode,
                                tier,
                                price,
                                Math.round(posX * 100.0) / 100.0,
                                Math.round(posY * 100.0) / 100.0,
                                Math.round(posZ * 100.0) / 100.0,
                                eyeHeightY,
                                Math.round(viewAngleDeg * 10.0) / 10.0,
                                Math.round(distanceMeters * 10.0) / 10.0
                        );
                        seats.add(seat);
                    }
                }
                auditoriumSeatRepository.saveAll(seats);
            }
        }
    }

    private void seedShowtimes() {
        if (movieShowtimeRepository.count() > 0) return;

        List<Film> films = filmRepository.findAll();
        List<Cinema> cinemas = cinemaRepository.findAll();
        if (films.isEmpty() || cinemas.isEmpty()) return;

        LocalDate today = LocalDate.now();
        LocalTime[] times = {
                LocalTime.of(10, 30),
                LocalTime.of(14, 15),
                LocalTime.of(18, 45),
                LocalTime.of(22, 15)
        };

        String[] formats = {"IMAX 4K Laser", "Dolby Atmos", "3D Laser"};
        BigDecimal[] prices = {new BigDecimal("480.00"), new BigDecimal("380.00"), new BigDecimal("320.00")};

        List<MovieShowtime> showtimes = new ArrayList<>();

        for (Cinema cinema : cinemas) {
            List<Screen> cinemaScreens = screenRepository.findByCinemaId(cinema.getId());
            if (cinemaScreens.isEmpty()) continue;

            for (int dayOffset = 0; dayOffset < 3; dayOffset++) {
                LocalDate showDate = today.plusDays(dayOffset);

                for (int s = 0; s < Math.min(3, cinemaScreens.size()); s++) {
                    Screen screen = cinemaScreens.get(s);
                    Film film = films.get((s + dayOffset) % films.size());

                    for (int t = 0; t < times.length; t++) {
                        MovieShowtime st = new MovieShowtime(
                                film.getId(),
                                cinema.getId(),
                                screen.getId(),
                                showDate,
                                times[t],
                                formats[s % formats.length],
                                prices[s % prices.length],
                                "ACTIVE"
                        );
                        showtimes.add(st);
                    }
                }
            }
        }

        movieShowtimeRepository.saveAll(showtimes);
    }

    private void seedMovieReviews(User audienceUser) {
        if (movieReviewRepository.count() > 0) return;

        List<Film> films = filmRepository.findAll();
        if (films.isEmpty()) return;

        List<MovieReview> reviews = new ArrayList<>();

        // Oppenheimer
        films.stream().filter(f -> f.getCode().equals("FLM-2026-001")).findFirst().ifPresent(film -> {
            reviews.add(createReview(film.getId(), audienceUser.getId(), audienceUser.getFullName(), "PERFECTION",
                    "Nolan's Magnum Opus", "The intensity, sound design, and Cillian Murphy's performance are absolute perfection. A defining film of the 21st century.", true, 42));
            reviews.add(createReview(film.getId(), 2L, "Priya K.", "PERFECTION",
                    "Unmatched Sound Design in IMAX", "The Trinity sequence shook the entire auditorium. Ludwig Goransson's score is pure genius.", true, 28));
            reviews.add(createReview(film.getId(), 3L, "Kabir M.", "GOOD",
                    "Brilliant dialogue and pacing", "A complex 3-hour biographical thriller that feels like 90 minutes. Required viewing.", false, 15));
        });

        // Dune Part Two
        films.stream().filter(f -> f.getCode().equals("FLM-2026-002")).findFirst().ifPresent(film -> {
            reviews.add(createReview(film.getId(), audienceUser.getId(), audienceUser.getFullName(), "PERFECTION",
                    "Monumental Sci-Fi Triumph", "Denis Villeneuve has crafted something timeless. The worm riding sequence is cinematic history.", true, 58));
            reviews.add(createReview(film.getId(), 4L, "Ananya D.", "PERFECTION",
                    "Audiovisual Greatness", "Austin Butler's Feyd-Rautha is hypnotic. Do not watch this on anything less than the biggest IMAX screen possible.", true, 34));
            reviews.add(createReview(film.getId(), 5L, "Rohan V.", "GOOD",
                    "Massive Scale and Emotion", "Immaculate production design and sound. A rare sequel that eclipses the original.", false, 19));
        });

        // The Dark Knight
        films.stream().filter(f -> f.getCode().equals("FLM-2026-003")).findFirst().ifPresent(film -> {
            reviews.add(createReview(film.getId(), audienceUser.getId(), audienceUser.getFullName(), "PERFECTION",
                    "The Benchmark of Superhero Cinema", "Heath Ledger's Joker is legendary. The ethical dilemmas and practical stunts remain unmatched.", true, 89));
            reviews.add(createReview(film.getId(), 2L, "Priya K.", "PERFECTION",
                    "Endlessly Rewatchable", "Every scene has iconic quotes. Hans Zimmer and James Newton Howard's score is chilling.", true, 44));
        });

        // Interstellar
        films.stream().filter(f -> f.getCode().equals("FLM-2026-004")).findFirst().ifPresent(film -> {
            reviews.add(createReview(film.getId(), audienceUser.getId(), audienceUser.getFullName(), "PERFECTION",
                    "Pure Emotional Gravity", "The docking sequence with 'No Time For Caution' gives me chills every single time. A timeless masterpiece.", true, 76));
            reviews.add(createReview(film.getId(), 3L, "Kabir M.", "PERFECTION",
                    "Transcendent Space Odyssey", "Combines hard physics with pure heart. The 5D tesseract climax is visionary.", true, 39));
        });

        // Inception
        films.stream().filter(f -> f.getCode().equals("FLM-2026-005")).findFirst().ifPresent(film -> {
            reviews.add(createReview(film.getId(), 4L, "Ananya D.", "PERFECTION",
                    "Mind-Bending Dream Architecture", "The rotating corridor hallway fight is practical cinema wizardry. Still fascinating 15 years later.", false, 25));
        });

        // Blade Runner 2049
        films.stream().filter(f -> f.getCode().equals("FLM-2026-006")).findFirst().ifPresent(film -> {
            reviews.add(createReview(film.getId(), 5L, "Rohan V.", "PERFECTION",
                    "Roger Deakins' Masterpiece", "Every frame could hang in the Louvre. Atmospheric, philosophical, and melancholic.", true, 31));
        });

        movieReviewRepository.saveAll(reviews);
    }

    private MovieReview createReview(Long filmId, Long userId, String userName, String rating, String title, String comment, boolean verified, int helpfulVotes) {
        MovieReview r = new MovieReview();
        r.setFilmId(filmId);
        r.setUserId(userId);
        r.setUserName(userName);
        r.setRatingCategory(rating);
        r.setTitle(title);
        r.setComment(comment);
        r.setIsVerifiedBuyer(verified);
        r.setHelpfulVotes(helpfulVotes);
        r.setCreatedAt(LocalDateTime.now().minusDays(2));
        r.setUpdatedAt(LocalDateTime.now().minusDays(2));
        return r;
    }

    private void seedSampleBookings(User audienceUser) {
        if (bookingRepository.count() > 0) return;

        List<MovieShowtime> showtimes = movieShowtimeRepository.findAll();
        if (showtimes.isEmpty()) return;

        MovieShowtime showtime = showtimes.get(0);
        List<AuditoriumSeat> seats = auditoriumSeatRepository.findByScreenIdAndIsActiveTrueOrderByRowLabelAscSeatNumberAsc(showtime.getScreenId());
        if (seats.size() < 10) return;

        Film film1 = filmRepository.findById(showtime.getFilmId()).orElse(null);
        Cinema cinema1 = cinemaRepository.findById(showtime.getCinemaId()).orElse(null);
        Screen screen1 = screenRepository.findById(showtime.getScreenId()).orElse(null);

        // Booking 1: Two Recliner Seats
        AuditoriumSeat s1 = seats.get(seats.size() - 5); // Row H
        AuditoriumSeat s2 = seats.get(seats.size() - 6);

        Booking b1 = new Booking();
        b1.setBookingReference("CNH-2026-482910");
        b1.setUserId(audienceUser.getId());
        b1.setCinemaholicUserId(audienceUser.getId());
        b1.setCustomerName("Aarav Sharma");
        b1.setCustomerEmail("audience@cinemaholic.com");
        b1.setCustomerPhone("+91 98765 43210");
        b1.setShowtimeId(showtime.getId());
        b1.setFilmId(showtime.getFilmId());
        b1.setFilmTitle(film1 != null ? film1.getTitle() : "Oppenheimer");
        b1.setCinemaId(showtime.getCinemaId());
        b1.setCinemaName(cinema1 != null ? cinema1.getName() : "PVR ICON Phoenix Palladium");
        b1.setScreenId(showtime.getScreenId());
        b1.setScreenName(screen1 != null ? screen1.getName() : "Screen 1 (IMAX Laser)");
        b1.setScreenFormat(showtime.getFormat());
        b1.setShowDate(showtime.getShowDate());
        b1.setShowTime(showtime.getShowTime());
        b1.setShowDayOfWeek(showtime.getShowDate().getDayOfWeek().name());
        b1.setShowTimeFormatted(showtime.getShowTime().format(DateTimeFormatter.ofPattern("hh:mm a")));
        b1.setSeatCodes(s1.getSeatCode() + ", " + s2.getSeatCode());
        b1.setSeatCount(2);
        b1.setSubtotal(s1.getPriceModifier().add(s2.getPriceModifier()));
        b1.setGstTax(b1.getSubtotal().multiply(new BigDecimal("0.18")).setScale(2, RoundingMode.HALF_UP));
        b1.setConvenienceFee(new BigDecimal("60.00"));
        b1.setTotalAmount(b1.getSubtotal().add(b1.getGstTax()).add(b1.getConvenienceFee()));
        b1.setStatus("CONFIRMED");
        b1.setPaymentMethod("UPI");
        b1.setPaymentReference("UPI-HDFC-982104");
        b1.setCreatedAt(LocalDateTime.now().minusDays(1));
        b1.setConfirmedAt(LocalDateTime.now().minusDays(1));
        b1.setQrCodeData("CINEMAHOLIC:CNH-2026-482910:" + showtime.getId() + ":" + s1.getSeatCode() + "," + s2.getSeatCode());
        Booking savedB1 = bookingRepository.save(b1);

        bookingSeatRepository.save(new BookingSeat(savedB1.getId(), showtime.getId(), s1.getId(), s1.getSeatCode(), s1.getTier(), s1.getPriceModifier()));
        bookingSeatRepository.save(new BookingSeat(savedB1.getId(), showtime.getId(), s2.getId(), s2.getSeatCode(), s2.getTier(), s2.getPriceModifier()));

        // Booking 2: One Prime Seat
        if (showtimes.size() > 1) {
            MovieShowtime showtime2 = showtimes.get(1);
            List<AuditoriumSeat> seats2 = auditoriumSeatRepository.findByScreenIdAndIsActiveTrueOrderByRowLabelAscSeatNumberAsc(showtime2.getScreenId());
            AuditoriumSeat primeSeat = seats2.stream().filter(s -> "PRIME".equals(s.getTier())).findFirst().orElse(seats2.get(20));

            Film film2 = filmRepository.findById(showtime2.getFilmId()).orElse(null);
            Cinema cinema2 = cinemaRepository.findById(showtime2.getCinemaId()).orElse(null);
            Screen screen2 = screenRepository.findById(showtime2.getScreenId()).orElse(null);

            Booking b2 = new Booking();
            b2.setBookingReference("CNH-2026-731924");
            b2.setUserId(audienceUser.getId());
            b2.setCinemaholicUserId(audienceUser.getId());
            b2.setCustomerName("Aarav Sharma");
            b2.setCustomerEmail("audience@cinemaholic.com");
            b2.setCustomerPhone("+91 98765 43210");
            b2.setShowtimeId(showtime2.getId());
            b2.setFilmId(showtime2.getFilmId());
            b2.setFilmTitle(film2 != null ? film2.getTitle() : "Dune: Part Two");
            b2.setCinemaId(showtime2.getCinemaId());
            b2.setCinemaName(cinema2 != null ? cinema2.getName() : "PVR ICON Phoenix Palladium");
            b2.setScreenId(showtime2.getScreenId());
            b2.setScreenName(screen2 != null ? screen2.getName() : "Screen 2");
            b2.setScreenFormat(showtime2.getFormat());
            b2.setShowDate(showtime2.getShowDate());
            b2.setShowTime(showtime2.getShowTime());
            b2.setShowDayOfWeek(showtime2.getShowDate().getDayOfWeek().name());
            b2.setShowTimeFormatted(showtime2.getShowTime().format(DateTimeFormatter.ofPattern("hh:mm a")));
            b2.setSeatCodes(primeSeat.getSeatCode());
            b2.setSeatCount(1);
            b2.setSubtotal(primeSeat.getPriceModifier());
            b2.setGstTax(b2.getSubtotal().multiply(new BigDecimal("0.18")).setScale(2, RoundingMode.HALF_UP));
            b2.setConvenienceFee(new BigDecimal("30.00"));
            b2.setTotalAmount(b2.getSubtotal().add(b2.getGstTax()).add(b2.getConvenienceFee()));
            b2.setStatus("CONFIRMED");
            b2.setPaymentMethod("CARD");
            b2.setPaymentReference("VISA-AUTH-419082");
            b2.setCreatedAt(LocalDateTime.now().minusHours(5));
            b2.setConfirmedAt(LocalDateTime.now().minusHours(5));
            b2.setQrCodeData("CINEMAHOLIC:CNH-2026-731924:" + showtime2.getId() + ":" + primeSeat.getSeatCode());
            Booking savedB2 = bookingRepository.save(b2);

            bookingSeatRepository.save(new BookingSeat(savedB2.getId(), showtime2.getId(), primeSeat.getId(), primeSeat.getSeatCode(), primeSeat.getTier(), primeSeat.getPriceModifier()));
        }
    }

    private void seedWatchlist(User audienceUser) {
        if (watchlistRepository.count() > 0) return;

        List<Film> films = filmRepository.findAll();
        for (int i = 0; i < Math.min(3, films.size()); i++) {
            watchlistRepository.save(new Watchlist(audienceUser.getId(), films.get(i).getId()));
        }
    }
}

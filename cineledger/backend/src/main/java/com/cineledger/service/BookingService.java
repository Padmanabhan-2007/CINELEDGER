package com.cineledger.service;

import com.cineledger.dto.BookingConfirmRequest;
import com.cineledger.dto.BookingConfirmationDto;
import com.cineledger.dto.SeatHoldRequest;
import com.cineledger.dto.SeatHoldResponse;
import com.cineledger.entity.*;
import com.cineledger.exception.BadRequestException;
import com.cineledger.exception.ConflictException;
import com.cineledger.exception.ResourceNotFoundException;
import com.cineledger.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final TemporarySeatHoldRepository temporarySeatHoldRepository;
    private final MovieShowtimeRepository movieShowtimeRepository;
    private final AuditoriumSeatRepository auditoriumSeatRepository;
    private final FilmRepository filmRepository;
    private final CinemaRepository cinemaRepository;
    private final ScreenRepository screenRepository;
    private final CinemaholicUserRepository cinemaholicUserRepository;
    private final AuditService auditService;
    private final SecureRandom random = new SecureRandom();

    public BookingService(BookingRepository bookingRepository,
                          BookingSeatRepository bookingSeatRepository,
                          TemporarySeatHoldRepository temporarySeatHoldRepository,
                          MovieShowtimeRepository movieShowtimeRepository,
                          AuditoriumSeatRepository auditoriumSeatRepository,
                          FilmRepository filmRepository,
                          CinemaRepository cinemaRepository,
                          ScreenRepository screenRepository,
                          CinemaholicUserRepository cinemaholicUserRepository,
                          AuditService auditService) {
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.temporarySeatHoldRepository = temporarySeatHoldRepository;
        this.movieShowtimeRepository = movieShowtimeRepository;
        this.auditoriumSeatRepository = auditoriumSeatRepository;
        this.filmRepository = filmRepository;
        this.cinemaRepository = cinemaRepository;
        this.screenRepository = screenRepository;
        this.cinemaholicUserRepository = cinemaholicUserRepository;
        this.auditService = auditService;
    }

    @Transactional
    public SeatHoldResponse holdSeats(SeatHoldRequest request, Long userId) {
        if (request.getSeatIds() == null || request.getSeatIds().isEmpty()) {
            throw new BadRequestException("At least one seat must be selected");
        }

        MovieShowtime showtime = movieShowtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found with id: " + request.getShowtimeId()));

        LocalDateTime now = LocalDateTime.now();

        // 1. Purge expired holds
        temporarySeatHoldRepository.deleteByExpiresAtBefore(now);

        // 2. Concurrency check: Ensure no seat is already confirmed/booked
        for (Long seatId : request.getSeatIds()) {
            if (bookingSeatRepository.existsByShowtimeIdAndSeatId(request.getShowtimeId(), seatId)) {
                throw new ConflictException("Seat has already been booked by another audience member. Please select another seat.");
            }
        }

        // 3. Concurrency check: Ensure no active temporary hold by another user
        List<TemporarySeatHold> activeHolds = temporarySeatHoldRepository.findByShowtimeIdAndExpiresAtAfter(request.getShowtimeId(), now);
        for (TemporarySeatHold hold : activeHolds) {
            if (request.getSeatIds().contains(hold.getSeatId()) && !hold.getUserId().equals(userId)) {
                throw new ConflictException("One or more selected seats are currently reserved by another guest. Please try another seat.");
            }
        }

        // 4. Generate or refresh hold token (10-minute hold window)
        String holdToken = (request.getHoldToken() != null && !request.getHoldToken().isBlank())
                ? request.getHoldToken()
                : UUID.randomUUID().toString();

        LocalDateTime expiresAt = now.plusMinutes(10);

        // Remove any previous holds for this token
        temporarySeatHoldRepository.deleteByHoldToken(holdToken);

        // Create new holds
        for (Long seatId : request.getSeatIds()) {
            TemporarySeatHold hold = new TemporarySeatHold(request.getShowtimeId(), seatId, userId, holdToken, expiresAt);
            temporarySeatHoldRepository.save(hold);
        }

        // 5. Calculate pricing waterfall
        List<AuditoriumSeat> seats = auditoriumSeatRepository.findByIdIn(request.getSeatIds());
        List<String> seatCodes = seats.stream().map(AuditoriumSeat::getSeatCode).collect(Collectors.toList());

        BigDecimal subtotal = BigDecimal.ZERO;
        for (AuditoriumSeat seat : seats) {
            BigDecimal seatPrice = seat.getPriceModifier() != null ? seat.getPriceModifier() : showtime.getBasePrice();
            subtotal = subtotal.add(seatPrice);
        }

        BigDecimal gstRate = new BigDecimal("0.18");
        BigDecimal gstTax = subtotal.multiply(gstRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal convenienceFeePerSeat = new BigDecimal("30.00");
        BigDecimal convenienceFee = convenienceFeePerSeat.multiply(new BigDecimal(request.getSeatIds().size())).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(gstTax).add(convenienceFee);

        SeatHoldResponse response = new SeatHoldResponse();
        response.setHoldToken(holdToken);
        response.setShowtimeId(request.getShowtimeId());
        response.setSeatIds(request.getSeatIds());
        response.setSeatCodes(seatCodes);
        response.setExpiresAt(expiresAt);
        response.setExpiresInSeconds(ChronoUnit.SECONDS.between(now, expiresAt));
        response.setSubtotal(subtotal);
        response.setGstTax(gstTax);
        response.setConvenienceFee(convenienceFee);
        response.setTotalAmount(totalAmount);

        return response;
    }

    @Transactional
    public BookingConfirmationDto confirmBooking(BookingConfirmRequest request, Long userId) {
        LocalDateTime now = LocalDateTime.now();

        MovieShowtime showtime = movieShowtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found with id: " + request.getShowtimeId()));

        // 1. Concurrency check: Ensure no seat is already booked/paid for
        for (Long seatId : request.getSeatIds()) {
            if (bookingSeatRepository.existsByShowtimeIdAndSeatId(request.getShowtimeId(), seatId)) {
                throw new ConflictException("Seat has already been booked. Transaction cannot proceed.");
            }
        }

        // 2. Clear any temporary holds for this token
        if (request.getHoldToken() != null && !request.getHoldToken().isBlank()) {
            temporarySeatHoldRepository.deleteByHoldToken(request.getHoldToken());
        }

        // 3. Resolve metadata: Film, Cinema, Screen
        Film film = filmRepository.findById(showtime.getFilmId()).orElse(null);
        Cinema cinema = cinemaRepository.findById(showtime.getCinemaId()).orElse(null);
        Screen screen = screenRepository.findById(showtime.getScreenId()).orElse(null);

        String filmTitle = film != null ? film.getTitle() : "Cinema Screening";
        String cinemaName = cinema != null ? cinema.getName() : "PVR INOX";
        String screenName = screen != null ? screen.getName() : "Screen " + showtime.getScreenId();
        String screenFormat = showtime.getFormat() != null ? showtime.getFormat() : "IMAX 4K Laser";

        LocalDate showDate = showtime.getShowDate() != null ? showtime.getShowDate() : LocalDate.now();
        LocalTime showTime = showtime.getShowTime() != null ? showtime.getShowTime() : LocalTime.of(19, 0);
        String showDayOfWeek = showDate.getDayOfWeek().name();
        String showTimeFormatted = showTime.format(DateTimeFormatter.ofPattern("hh:mm a"));

        // 4. Resolve Cinemaholic User
        String customerEmail = request.getCustomerEmail() != null && !request.getCustomerEmail().isBlank()
                ? request.getCustomerEmail().trim().toLowerCase()
                : "audience@cinemaholic.com";
        String customerName = request.getCustomerName() != null && !request.getCustomerName().isBlank()
                ? request.getCustomerName().trim()
                : "Aarav Sharma";
        String customerPhone = request.getCustomerPhone() != null ? request.getCustomerPhone().trim() : "+91 98765 43210";

        CinemaholicUser cinemaholicUser = cinemaholicUserRepository.findByEmail(customerEmail)
                .orElseGet(() -> {
                    CinemaholicUser newUser = new CinemaholicUser(
                            customerEmail, customerName, customerPhone, "demo-hashed-pwd",
                            "VIP Premiere Club", screenFormat, 350, "Mumbai"
                    );
                    return cinemaholicUserRepository.save(newUser);
                });

        // 5. Calculate financial totals
        List<AuditoriumSeat> seats = auditoriumSeatRepository.findByIdIn(request.getSeatIds());
        BigDecimal subtotal = BigDecimal.ZERO;
        for (AuditoriumSeat seat : seats) {
            BigDecimal seatPrice = seat.getPriceModifier() != null ? seat.getPriceModifier() : showtime.getBasePrice();
            subtotal = subtotal.add(seatPrice);
        }

        BigDecimal gstTax = subtotal.multiply(new BigDecimal("0.18")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal convenienceFee = new BigDecimal("30.00").multiply(new BigDecimal(seats.size())).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(gstTax).add(convenienceFee);

        // 6. Generate unique reference e.g. CNH-2026-891024
        int refCode = 100000 + random.nextInt(900000);
        String bookingReference = "CNH-" + showDate.getYear() + "-" + refCode;

        List<String> seatCodesList = seats.stream().map(AuditoriumSeat::getSeatCode).collect(Collectors.toList());
        String seatCodesStr = String.join(", ", seatCodesList);

        // 7. Create & Persist Booking Entity with ALL required columns (day, time, customer, film, cinema)
        Booking booking = new Booking();
        booking.setBookingReference(bookingReference);
        booking.setUserId(userId != null ? userId : cinemaholicUser.getId());
        booking.setCinemaholicUserId(cinemaholicUser.getId());
        booking.setCustomerName(customerName);
        booking.setCustomerEmail(customerEmail);
        booking.setCustomerPhone(customerPhone);
        booking.setShowtimeId(request.getShowtimeId());
        booking.setFilmId(showtime.getFilmId());
        booking.setFilmTitle(filmTitle);
        booking.setCinemaId(showtime.getCinemaId());
        booking.setCinemaName(cinemaName);
        booking.setScreenId(showtime.getScreenId());
        booking.setScreenName(screenName);
        booking.setScreenFormat(screenFormat);
        booking.setShowDate(showDate);
        booking.setShowTime(showTime);
        booking.setShowDayOfWeek(showDayOfWeek);
        booking.setShowTimeFormatted(showTimeFormatted);
        booking.setSeatCodes(seatCodesStr);
        booking.setSeatCount(seats.size());
        booking.setSubtotal(subtotal);
        booking.setGstTax(gstTax);
        booking.setConvenienceFee(convenienceFee);
        booking.setTotalAmount(totalAmount);
        booking.setStatus("CONFIRMED");
        booking.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "UPI");
        booking.setPaymentReference(request.getPaymentReference() != null ? request.getPaymentReference() : "PAY-" + System.currentTimeMillis());
        booking.setCreatedAt(now);
        booking.setConfirmedAt(now);

        String qrPayload = "CINEMAHOLIC:" + bookingReference + ":" + showtime.getId() + ":" + seatCodesStr;
        booking.setQrCodeData(qrPayload);

        Booking savedBooking = bookingRepository.save(booking);

        // 8. Create BookingSeat records
        for (AuditoriumSeat seat : seats) {
            BigDecimal price = seat.getPriceModifier() != null ? seat.getPriceModifier() : showtime.getBasePrice();
            BookingSeat bookingSeat = new BookingSeat(savedBooking.getId(), showtime.getId(), seat.getId(), seat.getSeatCode(), seat.getTier(), price);
            bookingSeatRepository.save(bookingSeat);
        }

        // 9. Remove temporary holds
        if (request.getHoldToken() != null && !request.getHoldToken().isBlank()) {
            temporarySeatHoldRepository.deleteByHoldToken(request.getHoldToken());
        }

        // 10. Record SHA-256 Chained Audit Event
        try {
            auditService.recordEvent(
                    customerEmail,
                    "ROLE_AUDIENCE",
                    "BOOKING_CONFIRMED",
                    "BOOKING",
                    savedBooking.getId(),
                    String.format("Audience member %s confirmed booking %s for %s (%s) on %s %s at %s. Total: ₹%s",
                            customerName, bookingReference, filmTitle, screenFormat, showDayOfWeek, showDate, showTimeFormatted, totalAmount)
            );
        } catch (Exception ignored) {}

        return toConfirmationDto(savedBooking, seats, showtime, film, cinema, screen);
    }

    public List<BookingConfirmationDto> getUserBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (bookings.isEmpty() && userId != null) {
            bookings = bookingRepository.findByCinemaholicUserIdOrderByCreatedAtDesc(userId);
        }
        return bookings.stream().map(this::toConfirmationDto).collect(Collectors.toList());
    }

    public BookingConfirmationDto getBookingByReference(String bookingReference, Long userId) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + bookingReference));

        return toConfirmationDto(booking);
    }

    @Transactional
    public BookingConfirmationDto cancelBooking(String bookingReference, Long userId) {
        Booking booking = bookingRepository.findByBookingReference(bookingReference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + bookingReference));

        if (!"CONFIRMED".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Only confirmed bookings can be cancelled");
        }

        booking.setStatus("CANCELLED");
        Booking saved = bookingRepository.save(booking);

        // Release the seats so others can book
        List<BookingSeat> seats = bookingSeatRepository.findByBookingId(booking.getId());
        bookingSeatRepository.deleteAll(seats);

        try {
            auditService.recordEvent(
                    booking.getCustomerEmail() != null ? booking.getCustomerEmail() : "audience",
                    "ROLE_AUDIENCE",
                    "BOOKING_CANCELLED",
                    "BOOKING",
                    saved.getId(),
                    "Cancelled booking " + bookingReference + ". Seats released."
            );
        } catch (Exception ignored) {}

        return toConfirmationDto(saved);
    }

    public BookingConfirmationDto toConfirmationDto(Booking booking) {
        MovieShowtime showtime = movieShowtimeRepository.findById(booking.getShowtimeId()).orElse(null);
        List<BookingSeat> bookingSeats = bookingSeatRepository.findByBookingId(booking.getId());
        List<String> seatCodes = bookingSeats.stream().map(BookingSeat::getSeatCode).collect(Collectors.toList());
        if (seatCodes.isEmpty() && booking.getSeatCodes() != null) {
            seatCodes = Arrays.stream(booking.getSeatCodes().split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());
        }

        BookingConfirmationDto dto = new BookingConfirmationDto();
        dto.setBookingId(booking.getId());
        dto.setBookingReference(booking.getBookingReference());
        dto.setShowtimeId(booking.getShowtimeId());
        dto.setSeatCodes(seatCodes);
        dto.setSeatCount(booking.getSeatCount());
        dto.setSubtotal(booking.getSubtotal());
        dto.setGstTax(booking.getGstTax());
        dto.setConvenienceFee(booking.getConvenienceFee());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setStatus(booking.getStatus());
        dto.setPaymentMethod(booking.getPaymentMethod());
        dto.setPaymentReference(booking.getPaymentReference());
        dto.setQrCodeData(booking.getQrCodeData());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setConfirmedAt(booking.getConfirmedAt());

        dto.setCustomerName(booking.getCustomerName());
        dto.setCustomerEmail(booking.getCustomerEmail());
        dto.setCustomerPhone(booking.getCustomerPhone());

        dto.setFilmId(booking.getFilmId());
        dto.setFilmTitle(booking.getFilmTitle());
        dto.setCinemaName(booking.getCinemaName());
        dto.setScreenName(booking.getScreenName());
        dto.setScreenFormat(booking.getScreenFormat());
        dto.setShowDate(booking.getShowDate());
        dto.setStartTime(booking.getShowTime());
        dto.setShowDayOfWeek(booking.getShowDayOfWeek());
        dto.setShowTimeFormatted(booking.getShowTimeFormatted());

        if (showtime != null) {
            if (dto.getFilmTitle() == null) {
                filmRepository.findById(showtime.getFilmId()).ifPresent(f -> {
                    dto.setFilmTitle(f.getTitle());
                    dto.setPosterUrl(f.getPosterUrl());
                });
            } else {
                filmRepository.findById(booking.getFilmId() != null ? booking.getFilmId() : showtime.getFilmId()).ifPresent(f -> {
                    dto.setPosterUrl(f.getPosterUrl());
                });
            }

            if (dto.getCinemaName() == null) {
                cinemaRepository.findById(showtime.getCinemaId()).ifPresent(c -> {
                    dto.setCinemaName(c.getName());
                    dto.setCinemaCity(c.getCity());
                });
            }
            if (dto.getScreenName() == null) {
                screenRepository.findById(showtime.getScreenId()).ifPresent(s -> {
                    dto.setScreenName(s.getName());
                });
            }
        }

        return dto;
    }

    private BookingConfirmationDto toConfirmationDto(Booking booking, List<AuditoriumSeat> seats,
                                                     MovieShowtime showtime, Film film, Cinema cinema, Screen screen) {
        BookingConfirmationDto dto = new BookingConfirmationDto();
        dto.setBookingId(booking.getId());
        dto.setBookingReference(booking.getBookingReference());
        dto.setShowtimeId(booking.getShowtimeId());
        dto.setFilmId(showtime.getFilmId());
        dto.setFilmTitle(film != null ? film.getTitle() : booking.getFilmTitle());
        dto.setPosterUrl(film != null ? film.getPosterUrl() : null);
        dto.setCinemaName(cinema != null ? cinema.getName() : booking.getCinemaName());
        dto.setCinemaCity(cinema != null ? cinema.getCity() : "Mumbai");
        dto.setScreenName(screen != null ? screen.getName() : booking.getScreenName());
        dto.setScreenFormat(booking.getScreenFormat());
        dto.setShowDate(booking.getShowDate());
        dto.setStartTime(booking.getShowTime());
        dto.setShowDayOfWeek(booking.getShowDayOfWeek());
        dto.setShowTimeFormatted(booking.getShowTimeFormatted());
        dto.setCustomerName(booking.getCustomerName());
        dto.setCustomerEmail(booking.getCustomerEmail());
        dto.setCustomerPhone(booking.getCustomerPhone());
        dto.setSeatCodes(seats.stream().map(AuditoriumSeat::getSeatCode).collect(Collectors.toList()));
        dto.setSeatCount(seats.size());
        dto.setSubtotal(booking.getSubtotal());
        dto.setGstTax(booking.getGstTax());
        dto.setConvenienceFee(booking.getConvenienceFee());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setStatus(booking.getStatus());
        dto.setPaymentMethod(booking.getPaymentMethod());
        dto.setPaymentReference(booking.getPaymentReference());
        dto.setQrCodeData(booking.getQrCodeData());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setConfirmedAt(booking.getConfirmedAt());

        return dto;
    }
}

package com.cineledger.repository;

import com.cineledger.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
    List<BookingSeat> findByBookingId(Long bookingId);
    List<BookingSeat> findByShowtimeId(Long showtimeId);
    boolean existsByShowtimeIdAndSeatId(Long showtimeId, Long seatId);
    List<BookingSeat> findByShowtimeIdAndSeatIdIn(Long showtimeId, List<Long> seatIds);
}


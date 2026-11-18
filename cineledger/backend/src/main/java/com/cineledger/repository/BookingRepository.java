package com.cineledger.repository;

import com.cineledger.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingReference(String bookingReference);
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Booking> findByCinemaholicUserIdOrderByCreatedAtDesc(Long cinemaholicUserId);
    List<Booking> findByShowtimeId(Long showtimeId);
    List<Booking> findByUserIdAndStatus(Long userId, String status);
    boolean existsByUserIdAndShowtimeIdAndStatus(Long userId, Long showtimeId, String status);
}


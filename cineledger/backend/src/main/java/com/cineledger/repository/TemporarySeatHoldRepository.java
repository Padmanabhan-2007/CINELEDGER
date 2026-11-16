package com.cineledger.repository;

import com.cineledger.entity.TemporarySeatHold;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TemporarySeatHoldRepository extends JpaRepository<TemporarySeatHold, Long> {

    List<TemporarySeatHold> findByShowtimeIdAndExpiresAtAfter(Long showtimeId, LocalDateTime now);

    List<TemporarySeatHold> findByHoldTokenAndExpiresAtAfter(String holdToken, LocalDateTime now);

    Optional<TemporarySeatHold> findByShowtimeIdAndSeatIdAndExpiresAtAfter(Long showtimeId, Long seatId, LocalDateTime now);

    @Modifying
    @Query("DELETE FROM TemporarySeatHold h WHERE h.holdToken = :holdToken")
    void deleteByHoldToken(@Param("holdToken") String holdToken);

    @Modifying
    @Query("DELETE FROM TemporarySeatHold h WHERE h.expiresAt < :now")
    void deleteByExpiresAtBefore(@Param("now") LocalDateTime now);

    @Modifying
    @Query("DELETE FROM TemporarySeatHold h WHERE h.showtimeId = :showtimeId AND h.seatId IN :seatIds")
    void deleteByShowtimeIdAndSeatIdIn(@Param("showtimeId") Long showtimeId, @Param("seatIds") List<Long> seatIds);
}


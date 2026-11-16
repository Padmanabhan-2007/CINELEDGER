package com.cineledger.repository;

import com.cineledger.entity.AuditoriumSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuditoriumSeatRepository extends JpaRepository<AuditoriumSeat, Long> {
    List<AuditoriumSeat> findByScreenIdAndIsActiveTrueOrderByRowLabelAscSeatNumberAsc(Long screenId);
    List<AuditoriumSeat> findByScreenId(Long screenId);
    Optional<AuditoriumSeat> findByScreenIdAndSeatCode(Long screenId, String seatCode);
    List<AuditoriumSeat> findByIdIn(List<Long> seatIds);
}


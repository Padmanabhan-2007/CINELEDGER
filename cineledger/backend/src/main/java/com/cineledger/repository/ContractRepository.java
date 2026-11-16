package com.cineledger.repository;

import com.cineledger.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    Optional<Contract> findByContractNumber(String contractNumber);
    List<Contract> findByFilmId(Long filmId);
    List<Contract> findByDistributorId(Long distributorId);
    List<Contract> findByExhibitorId(Long exhibitorId);
}

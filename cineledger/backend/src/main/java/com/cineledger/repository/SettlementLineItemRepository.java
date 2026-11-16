package com.cineledger.repository;

import com.cineledger.entity.SettlementLineItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettlementLineItemRepository extends JpaRepository<SettlementLineItem, Long> {
    List<SettlementLineItem> findBySettlementIdOrderByItemOrderAsc(Long settlementId);
    void deleteBySettlementId(Long settlementId);
}

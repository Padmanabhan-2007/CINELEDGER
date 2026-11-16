package com.cineledger;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.math.RoundingMode;

import static org.junit.jupiter.api.Assertions.*;

public class SettlementCalculationTest {

    @Test
    @DisplayName("Should correctly calculate percentage share using BigDecimal with HALF_UP rounding")
    void testBasicRevenueShareCalculation() {
        BigDecimal basis = new BigDecimal("50000.00");
        BigDecimal sharePct = new BigDecimal("45.00");

        BigDecimal calculatedShare = basis.multiply(sharePct)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        assertEquals(new BigDecimal("22500.00"), calculatedShare);
    }

    @Test
    @DisplayName("Should accurately apply tax and platform deductions from gross box office")
    void testDeductionsAndNetSettlementBasis() {
        BigDecimal gross = new BigDecimal("100000.00");
        BigDecimal taxRate = new BigDecimal("18.00"); // 18% GST
        BigDecimal convRate = new BigDecimal("2.50"); // 2.5% Convenience fee
        BigDecimal vpf = new BigDecimal("500.00");     // ₹500 VPF

        BigDecimal taxAmount = gross.multiply(taxRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal convAmount = gross.multiply(convRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal totalDeductions = taxAmount.add(convAmount).add(vpf).setScale(2, RoundingMode.HALF_UP);

        assertEquals(new BigDecimal("18000.00"), taxAmount);
        assertEquals(new BigDecimal("2500.00"), convAmount);
        assertEquals(new BigDecimal("21000.00"), totalDeductions);

        BigDecimal netBasis = gross.subtract(totalDeductions).setScale(2, RoundingMode.HALF_UP);
        assertEquals(new BigDecimal("79000.00"), netBasis);

        // 52.5% distributor share of net basis
        BigDecimal distSharePct = new BigDecimal("52.50");
        BigDecimal distAmount = netBasis.multiply(distSharePct).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal exhibAmount = netBasis.subtract(distAmount);

        assertEquals(new BigDecimal("41475.00"), distAmount);
        assertEquals(new BigDecimal("37525.00"), exhibAmount);
        assertEquals(netBasis, distAmount.add(exhibAmount));
    }

    @Test
    @DisplayName("Should maintain penny precision across fractional odd shares without drift")
    void testFractionalPennyPrecision() {
        BigDecimal basis = new BigDecimal("33333.33");
        BigDecimal sharePct = new BigDecimal("33.33");

        BigDecimal calculated = basis.multiply(sharePct).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        assertNotNull(calculated);
        assertEquals(2, calculated.scale());
        assertEquals(new BigDecimal("11110.00"), calculated);
    }
}

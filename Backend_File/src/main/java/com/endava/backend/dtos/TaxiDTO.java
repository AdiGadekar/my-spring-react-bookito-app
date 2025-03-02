package com.endava.backend.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class TaxiDTO {
    private Long taxiId;
    private String numberPlate;
    private String model;
    private String color;
    private Boolean availability;
    private BigDecimal pricePerKm;
    private LocalDateTime createdAt;
}

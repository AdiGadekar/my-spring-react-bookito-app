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
public class PaymentDTO {
    private Long paymentId;
    private Long bookingId; 
    private Long userId;
    private BigDecimal amount;
    private String paymentStatus; 
    private String paymentMethod; 
    private LocalDateTime paymentTime;
}

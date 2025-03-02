package com.endava.backend.dtos;

import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor(access = AccessLevel.PUBLIC)
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class BookingDTO {
    private Long bookingId;
    private Long userId; 
    private Long taxiId; 
    private Long driverId; 
    private String pickupLocation;
    private String dropoffLocation;
    private String status;
    private float distance; 
    private String carModel;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private PaymentDTO paymentDTO;
}

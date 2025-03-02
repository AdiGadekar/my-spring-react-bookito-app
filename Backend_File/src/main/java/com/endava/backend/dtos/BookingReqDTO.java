package com.endava.backend.dtos;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class BookingReqDTO {
    private Long userId; 
    private String pickupLocation;
    private String dropoffLocation;
    private String status;
    private String carModel;
    private float distance;
}

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
public class BookingHistroyDTO {
	private Long bookingId;
	private String customerName;
	private String driverName;
	private String pickupLocation;
	private String dropoffLocation;
	private String status;
	private float distance;
	private String carModel;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private BigDecimal amount;
	private String paymentStatus;
	private String paymentMethod;
	private String taxiNumberPlate;
}

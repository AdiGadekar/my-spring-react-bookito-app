package com.endava.backend.constant;

import java.util.Arrays;
import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class BookingStatus {
	public static List<String> getExcludedStatus() {
		return EXCLUDED_STATUS;
	}


	//booking status constants
	public static final String BOOKING_CONFIRMED = "Confirmed";
	public static final String BOOKING_CANCELLED = "Cancelled";
	public static final String BOOKING_IN_PROGRESS = "In_Progress";
	public static final String BOOKING_DEPARTED = "Departed";
	public static final String BOOKING_COMPLETED = "Completed";
	public static final String BOOKING_OTP = "11";

	//payment status constants
	public static final String PAYMENT_PENDING = "Pending";
	public static final String PAYMENT_CANCELLED = "Cancelled";
	public static final String PAYMNET_COMPLETED = "Completed";


	private static final List<String> EXCLUDED_STATUS = Arrays.asList(BOOKING_COMPLETED, BOOKING_CANCELLED);
}

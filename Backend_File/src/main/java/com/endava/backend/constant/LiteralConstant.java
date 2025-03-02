package com.endava.backend.constant;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)

public class LiteralConstant {
	public static final String USERNAME_EMPTY_ERROR_STRING = "Username cannot be empty";
	public static final String BOOKING_DETAILS_ERROR_STRING = "BookingDetails can't be null";
	public static final String BOOKING_ID_ERROR_STRING = "Booking not found with ID: ";
	public static final String DRIVER_ID_ERROR_STRING = "DriverId can't be null";
	
	public static final String WEBSOCKET_CUSTOMER_LISTEN_ENDPOINT = "/topic/customer/";
	public static final String WEBSOCKET_DRIVER_LISTEN_ENDPOINT = "/topic/driver/";
	public static final String USER_ID_ERROR_STRING = "User not found with ID: ";
}

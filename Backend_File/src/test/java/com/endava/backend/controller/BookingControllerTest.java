package com.endava.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.endava.backend.dtos.BookingDTO;
import com.endava.backend.dtos.BookingReqDTO;
import com.endava.backend.exception.ResourceNotFoundException;
import com.endava.backend.service.BookingService;
import com.endava.backend.websocket.impl.CustomerNotificationImpl;
import com.endava.backend.websocket.impl.DriverNotificationImpl;

@WebMvcTest(BookingController.class)
class BookingControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private BookingService bookingService;

	@MockitoBean
	private DriverNotificationImpl driverNotificationImpl;

	@MockitoBean
	private CustomerNotificationImpl customerNotificationImpl;

	private static final String BOOKING_JSON = "{ \"userId\": 9, \"carModel\": \"KIA\", \"pickupLocation\": \"123 Solapur\", \"dropoffLocation\": \"456 Valley\", \"status\": \"Confirmed\", \"distance\": 10.5 }";

	private BookingDTO createMockBooking(Long bookingId, Long userId, String status) {
		return BookingDTO.builder().bookingId(bookingId).userId(userId).taxiId(6L).driverId(8L)
				.pickupLocation("123 Solapur").dropoffLocation("456 Valley").status(status).distance(10.5f)
				.carModel("KIA").createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
				.paymentDTO(null)
				.build();
	}

	@Test
	void createBooking_Success() throws Exception {
		when(bookingService.createBooking(any(BookingReqDTO.class)))
				.thenReturn(createMockBooking(385L, 9L, "Confirmed"));

		mockMvc.perform(post("/api/bookings/create").contentType(MediaType.APPLICATION_JSON).content(BOOKING_JSON))
				.andExpect(status().isCreated()).andExpect(jsonPath("$.body.bookingId").value(385))
				.andExpect(jsonPath("$.body.status").value("Confirmed"));
	}

	@Test
	void createBooking_UserNotFound_ShouldReturnNotFound() throws Exception {
		when(bookingService.createBooking(any(BookingReqDTO.class)))
				.thenThrow(new ResourceNotFoundException("User not found with ID: 99"));

		mockMvc.perform(post("/api/bookings/create").contentType(MediaType.APPLICATION_JSON)
				.content(BOOKING_JSON.replace("\"userId\": 9", "\"userId\": 99"))).andExpect(status().isNotFound())
				.andExpect(jsonPath("$.body").value("User not found with ID: 99"));
	}
	
	
	@Test
	void createBooking_UserNotFound_ShouldReturnNotFound1() throws Exception {
		when(bookingService.createBooking(any(BookingReqDTO.class)))
				.thenThrow(new RuntimeException("User not found with ID: 99"));

		mockMvc.perform(post("/api/bookings/create").contentType(MediaType.APPLICATION_JSON)
				.content(BOOKING_JSON.replace("\"userId\": 9", "\"userId\": 99"))).andExpect(status().isInternalServerError())
				.andExpect(jsonPath("$.body").value("User not found with ID: 99"));
	}
	

	@Test
	void cancelBooking_Success() throws Exception {
		when(bookingService.cancelBooking(101L)).thenReturn(createMockBooking(101L, 9L, "Cancelled"));
		doNothing().when(driverNotificationImpl).notifyDriverCancellation(8L, createMockBooking(101L, 9L, "Cancelled"));

		mockMvc.perform(put("/api/bookings/cancel").param("bookingId", "101").contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk()).andExpect(jsonPath("$.body.status").value("Cancelled"));
	}

	@Test
	void cancelBooking_RideAlreadyStarted_ShouldReturnNotFound() throws Exception {
		when(bookingService.cancelBooking(102L))
				.thenThrow(new ResourceNotFoundException("Ride is Already In Progress"));

		mockMvc.perform(put("/api/bookings/cancel").param("bookingId", "102").contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isNotFound()).andExpect(jsonPath("$.body").value("Ride is Already In Progress"));
	}

	@Test
	void departBooking_Success() throws Exception {
		when(bookingService.departBooking(201L)).thenReturn(createMockBooking(201L, 10L, "Departed"));
		doNothing().when(customerNotificationImpl).notifyCustomerDeparture(10L,
				createMockBooking(201L, 10L, "Departed"));

		mockMvc.perform(patch("/api/bookings/depart").param("bookingId", "201").contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk()).andExpect(jsonPath("$.body.status").value("Departed"));
	}

	@Test
	void departBooking_BookingNotFound_ShouldReturnNotFound() throws Exception {
		when(bookingService.departBooking(999L)).thenThrow(new ResourceNotFoundException("Booking ID not found: 999"));

		mockMvc.perform(patch("/api/bookings/depart").param("bookingId", "999").contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isNotFound()).andExpect(jsonPath("$.body").value("Booking ID not found: 999"));
	}
}

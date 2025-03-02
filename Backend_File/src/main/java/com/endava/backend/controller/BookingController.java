package com.endava.backend.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.endava.backend.dtos.BookingDTO;
import com.endava.backend.dtos.BookingHistroyDTO;
import com.endava.backend.dtos.BookingReqDTO;
import com.endava.backend.response.ApiResponse;
import com.endava.backend.service.BookingService;
import com.endava.backend.websocket.impl.CustomerNotificationImpl;
import com.endava.backend.websocket.impl.DriverNotificationImpl;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BookingController {

	private final BookingService bookingService;

	private final DriverNotificationImpl driverNotificationImpl;

	private final CustomerNotificationImpl customerNotificationImpl;

	/**
	 * Create a new booking. Notifies the driver when a booking is created.
	 *
	 * @param bookingDTO The booking data transfer object.
	 * @return The created booking with status wrapped in ApiResponse.
	 */
	@PostMapping("/create")
	public ResponseEntity<ApiResponse<BookingDTO>> createBooking(@RequestBody BookingReqDTO bookingReqDTO) {
		BookingDTO createdBooking = bookingService.createBooking(bookingReqDTO);
		driverNotificationImpl.notifyDriverBooking(createdBooking.getDriverId(), createdBooking);
		return new ResponseEntity<>(new ApiResponse<>(createdBooking), HttpStatus.CREATED);
	}

	/**
	 * Cancel an existing booking. Notifies the driver about the cancellation.
	 *
	 * @param bookingId The ID of the booking to cancel.
	 * @return The cancelled booking with status wrapped in ApiResponse.
	 */
	@PutMapping("/cancel")
	public ResponseEntity<ApiResponse<BookingDTO>> cancelBooking(@RequestParam Long bookingId) {
		BookingDTO cancelledBooking = bookingService.cancelBooking(bookingId);
		driverNotificationImpl.notifyDriverCancellation(cancelledBooking.getDriverId(), cancelledBooking);
		return new ResponseEntity<>(new ApiResponse<>(cancelledBooking), HttpStatus.OK);
	}

	/**
	 * Mark the booking as "Departed." Notifies the customer that the driver has
	 * departed.
	 *
	 * @param bookingId The ID of the booking to mark as departed.
	 * @return The departed booking with status wrapped in ApiResponse.
	 */
	@PatchMapping("/depart")
	public ResponseEntity<ApiResponse<BookingDTO>> departBooking(@RequestParam Long bookingId) {
		BookingDTO departedBooking = bookingService.departBooking(bookingId);
		customerNotificationImpl.notifyCustomerDeparture(departedBooking.getUserId(), departedBooking);
		return new ResponseEntity<>(new ApiResponse<>(departedBooking), HttpStatus.OK);
	}

	/**
	 * Notify the customer that the driver has arrived at the pickup location.
	 *
	 * @param bookingId The ID of the booking.
	 * @return Success message with status wrapped in ApiResponse.
	 */
	@PostMapping("/arrivedAtPickup")
	public ResponseEntity<ApiResponse<String>> arrivedAtLocation(@RequestParam Long bookingId) {
		BookingDTO bookingDTO = bookingService.getBookingById(bookingId);
		customerNotificationImpl.notifyCustomerDriverArrived(bookingDTO.getUserId());
		return new ResponseEntity<>(new ApiResponse<>("Arrived at the Pickup location"), HttpStatus.OK);
	}

	/**
	 * Start the ride. Requires an OTP for validation and notifies the customer.
	 *
	 * @param bookingId   The ID of the booking.
	 * @param ridStartOtp The OTP to start the ride.
	 * @return The booking with status wrapped in ApiResponse.
	 */
	@PatchMapping("/start")
	public ResponseEntity<ApiResponse<BookingDTO>> startRide(@RequestParam Long bookingId,
			@RequestParam String ridStartOtp) {
		BookingDTO bookingDTO = bookingService.rideStarted(bookingId, ridStartOtp);
		customerNotificationImpl.notifyCustomerRideStarted(bookingDTO.getUserId(), bookingDTO);
		return new ResponseEntity<>(new ApiResponse<>(bookingDTO), HttpStatus.OK);
	}

	/**
	 * Notify the customer that the ride has been completed.
	 *
	 * @param bookingId The ID of the booking.
	 * @return Success message with status wrapped in ApiResponse.
	 */
	@PutMapping("/completeRide")
	public ResponseEntity<ApiResponse<String>> completeRide(@RequestParam Long bookingId) {
		BookingDTO bookingDTO = bookingService.getBookingById(bookingId);
		customerNotificationImpl.notifyCustomerRideCompletion(bookingDTO.getUserId());
		return new ResponseEntity<>(new ApiResponse<>("Ride Completed"), HttpStatus.OK);
	}

	/**
	 * Mark the booking as "Completed." Notifies the driver that payment is done.
	 *
	 * @param bookingId     The ID of the booking.
	 * @param paymentMethod The payment method used.
	 * @return The completed booking with status wrapped in ApiResponse.
	 */
	@PutMapping("/completeBooking")
	public ResponseEntity<ApiResponse<BookingDTO>> completeBooking(@RequestParam Long bookingId,
			@RequestParam String paymentMethod) {
		BookingDTO completedBooking = bookingService.completeBooking(bookingId, paymentMethod);
		driverNotificationImpl.notifyDriverPaymentDone(completedBooking.getDriverId(), completedBooking);
		return new ResponseEntity<>(new ApiResponse<>(completedBooking), HttpStatus.OK);
	}

	/**
	 * Retrieve booking history of a user.
	 *
	 * @param userId The ID of the user.
	 * @return The booking history of the user wrapped in ApiResponse.
	 */
	@GetMapping("/customerHistory")
	public ResponseEntity<ApiResponse<List<BookingDTO>>> getCustomerBookingHistory(@RequestParam Long userId) {
		List<BookingDTO> bookingHistory = bookingService.getBookingHistory(userId);
		return new ResponseEntity<>(new ApiResponse<>(bookingHistory), HttpStatus.OK);
	}

	/**
	 * Retrieve booking history of a driver.
	 *
	 * @param driverId The ID of the driver.
	 * @return The booking history of the driver wrapped in ApiResponse.
	 */
	@GetMapping("/driverHistory")
	public ResponseEntity<ApiResponse<List<BookingDTO>>> getDriverBookingHistory(@RequestParam Long driverId) {
		List<BookingDTO> driverBookingHistory = bookingService.getDriverBookingHistory(driverId);
		return new ResponseEntity<>(new ApiResponse<>(driverBookingHistory), HttpStatus.OK);
	}

	/**
	 * Retrieve booking details by booking ID.
	 *
	 * @param bookingId The ID of the booking.
	 * @return The booking details wrapped in ApiResponse.
	 */
	@GetMapping("/getBooking")
	public ResponseEntity<ApiResponse<BookingDTO>> getBookingById(@RequestParam Long bookingId) {
		BookingDTO bookingDTO = bookingService.getBookingById(bookingId);
		return new ResponseEntity<>(new ApiResponse<>(bookingDTO), HttpStatus.OK);
	}

	/**
	 * Retrieve confirmed bookings by customer ID.
	 *
	 * @param customerId The ID of the customer.
	 * @return The confirmed booking for the customer wrapped in ApiResponse.
	 */
	@GetMapping("/getBookingByCustomer")
	public ResponseEntity<ApiResponse<BookingDTO>> getBookingByCustomerIdAndStatusConfirmed(
			@RequestParam Long customerId) {
		BookingDTO bookingDTO = bookingService.getBookingByCustomerIdAndStatusConfirmed(customerId);
		return new ResponseEntity<>(new ApiResponse<>(bookingDTO), HttpStatus.OK);
	}

	/**
	 * Retrieve confirmed bookings by driver ID.
	 *
	 * @param driverId The ID of the driver.
	 * @return The confirmed booking for the driver wrapped in ApiResponse.
	 */
	@GetMapping("/getBookingByDriver")
	public ResponseEntity<ApiResponse<BookingDTO>> getBookingByDriverIdAndStatusConfirmed(@RequestParam Long driverId) {
		BookingDTO bookingDTO = bookingService.getBookingByDriverIdAndStatusConfirmed(driverId);
		return new ResponseEntity<>(new ApiResponse<>(bookingDTO), HttpStatus.OK);
	}

	/**
	 * Retrieve all bookings in the system.
	 *
	 * @return The list of all bookings wrapped in ApiResponse.
	 */
	@GetMapping("/getAllBookings")
	public ResponseEntity<ApiResponse<List<BookingDTO>>> getAllBookings() {
		List<BookingDTO> allBookings = bookingService.getAllBooking();
		return new ResponseEntity<>(new ApiResponse<>(allBookings), HttpStatus.OK);
	}

	/**
	 * Retrieve all the monthly earnings of driver.
	 *
	 * @return List of monthly earnings for 2025 wrapped in ApiResponse.
	 */
	@GetMapping("/getMonthlyEarning")
	public ResponseEntity<ApiResponse<List<BigDecimal>>> getDriverMonthlyEarnings(@RequestParam Long driverId) {
		List<BigDecimal> monthlyEarnings = bookingService.getDriverMonthlyEarnings(driverId);
		return new ResponseEntity<>(new ApiResponse<>(monthlyEarnings), HttpStatus.OK);
	}

	/**
	 * Retrieve all the booking history.
	 *
	 * @return List of all bookings with relevant data wrapped in ApiResponse.
	 */
	@GetMapping("/getAllBookingHistory")
	public ResponseEntity<ApiResponse<List<BookingHistroyDTO>>> getAllBookingHistory() {
		List<BookingHistroyDTO> historyDto = bookingService.getAllBookingHistory();
		return new ResponseEntity<>(new ApiResponse<>(historyDto), HttpStatus.OK);
	}
}

package com.endava.backend.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.endava.backend.constant.BookingStatus;
import com.endava.backend.constant.LiteralConstant;
import com.endava.backend.dtos.BookingDTO;
import com.endava.backend.dtos.BookingHistroyDTO;
import com.endava.backend.dtos.BookingReqDTO;
import com.endava.backend.entities.Booking;
import com.endava.backend.entities.Driver;
import com.endava.backend.entities.Payment;
import com.endava.backend.entities.Taxi;
import com.endava.backend.entities.User;
import com.endava.backend.exception.ResourceNotAvailableException;
import com.endava.backend.exception.ResourceNotFoundException;
import com.endava.backend.mapper.BookingMapper;
import com.endava.backend.mapper.UserMapper;
import com.endava.backend.repository.BookingRepo;
import com.endava.backend.repository.DriverRepo;
import com.endava.backend.repository.TaxiRepo;
import com.endava.backend.service.BookingService;
import com.endava.backend.service.UserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor(access = AccessLevel.PACKAGE)
public class BookingServiceImpl implements BookingService {

	private final BookingRepo bookingRepository;
	private final BookingMapper bookingMapper;
	private final UserMapper userMapper;
	private final TaxiRepo taxiRepository;
	private final DriverRepo driverRepository;
	private final UserService userService;


	/**
	 * Creates a new booking, assigns a taxi and driver, calculates the fare, and
	 * saves the booking and payment information. It also marks the taxi and driver
	 * as unavailable.
	 *
	 * @param bookingDTO The booking details.
	 * @return The created booking as a DTO.
	 */
	@Override
	public BookingDTO createBooking(BookingReqDTO bookingReqDTO) {
		if (bookingReqDTO == null ) {
			throw new IllegalArgumentException(LiteralConstant.BOOKING_DETAILS_ERROR_STRING);
		}

		// Get user entity from the user service
		User user = userMapper.dtoToEntity(userService.getUserById(bookingReqDTO.getUserId()));

		// Assign an available taxi to the booking
		Taxi taxi = assignTaxiToBooking(bookingReqDTO.getCarModel());

		// Assign an available driver to the taxi
		Driver driver = assignDriverToTaxi();

		// Map the bookingDTO to booking entity
		Booking booking = bookingMapper.reqDtoToEntity(bookingReqDTO);

		// Set the created time and initial status
		booking.setCreatedAt(LocalDateTime.now());
		booking.setStatus(BookingStatus.BOOKING_CONFIRMED);
		booking.setUser(user);
		booking.setTaxi(taxi);
		booking.setDriver(driver);

		// Create the payment object and set status as pending
		Payment payment = Payment.builder().booking(booking).user(user).amount(calculateFare(booking))
				.paymentStatus(BookingStatus.PAYMENT_PENDING).paymentMethod(BookingStatus.PAYMENT_PENDING).build();

		// Link payment with booking
		booking.setPayment(payment);

		// Save the booking entity in the repository
		Booking savedBooking = bookingRepository.save(booking);

		// Mark taxi and driver as unavailable
		taxi.setAvailability(false);
		driver.setAvailability(false);
		taxiRepository.save(taxi);
		driverRepository.save(driver);

		// Return the saved booking as DTO
		return bookingMapper.entityToDto(savedBooking);
	}

	/**
	 * Starts the ride for a booking and validates the OTP.
	 * 
	 * @param bookingId    The booking ID.
	 * @param rideStartOtp The OTP entered by the customer.
	 * @return The updated booking as a DTO.
	 */
	@Override
	public BookingDTO rideStarted(Long bookingId, String rideStartOtp) {
		Optional.ofNullable(bookingId)
				.orElseThrow(() -> new IllegalArgumentException(LiteralConstant.BOOKING_DETAILS_ERROR_STRING));
		Optional.ofNullable(rideStartOtp).orElseThrow(() -> new IllegalArgumentException("OTP can't be null"));

		return bookingRepository.findById(bookingId).map(booking -> {
			// OTP validation logic
			if (rideStartOtp.equalsIgnoreCase(
					String.valueOf(booking.getUser().getUserId() + String.valueOf(booking.getUser().getUserId()))
							+ BookingStatus.BOOKING_OTP)) {
				booking.setStatus(BookingStatus.BOOKING_IN_PROGRESS);
				booking.getPayment().setPaymentStatus(BookingStatus.PAYMENT_PENDING);
				booking.getPayment().setPaymentMethod(BookingStatus.PAYMENT_PENDING);
				bookingRepository.save(booking);
				return bookingMapper.entityToDto(booking);
			} else {
				throw new IllegalArgumentException("Invalid Otp Entered");
			}
		}).orElseThrow(() -> new ResourceNotFoundException(LiteralConstant.BOOKING_ID_ERROR_STRING + bookingId));
	}

	/**
	 * Marks the booking as departed.
	 * 
	 * @param bookingId The booking ID.
	 * @return The updated booking as a DTO.
	 */
	@Override
	public BookingDTO departBooking(Long bookingId) {
		Optional.ofNullable(bookingId)
				.orElseThrow(() -> new IllegalArgumentException(LiteralConstant.BOOKING_DETAILS_ERROR_STRING));

		return bookingRepository.findById(bookingId).map(booking -> {
			booking.setStatus(BookingStatus.BOOKING_DEPARTED);
			booking.getPayment().setPaymentStatus(BookingStatus.PAYMENT_PENDING);
			booking.getPayment().setPaymentMethod(BookingStatus.PAYMENT_PENDING);
			bookingRepository.save(booking);
			return bookingMapper.entityToDto(booking);
		}).orElseThrow(() -> new ResourceNotFoundException(LiteralConstant.BOOKING_ID_ERROR_STRING + bookingId));
	}

	/**
	 * Completes the booking and updates the payment status. Marks the taxi and
	 * driver as available again.
	 * 
	 * @param bookingId     The booking ID.
	 * @param bookingMethod The method of payment used for the booking.
	 * @return The updated booking as a DTO.
	 */
	@Override
	public synchronized BookingDTO completeBooking(Long bookingId, String bookingMethod) {
		Optional.ofNullable(bookingId)
				.orElseThrow(() -> new IllegalArgumentException(LiteralConstant.BOOKING_DETAILS_ERROR_STRING));
		Optional.ofNullable(bookingMethod)
				.orElseThrow(() -> new IllegalArgumentException("BookingMethod can't be null"));

		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new ResourceNotFoundException(LiteralConstant.BOOKING_ID_ERROR_STRING + bookingId));

		// Set status to completed
		booking.setStatus(BookingStatus.BOOKING_COMPLETED);
		booking.setUpdatedAt(LocalDateTime.now());

		// Update payment status
		booking.getPayment().setPaymentStatus(BookingStatus.PAYMNET_COMPLETED);
		booking.getPayment().setPaymentMethod(bookingMethod);
		booking.getPayment().setPaymentTime(LocalDateTime.now());

		// Save updated booking
		bookingRepository.save(booking);
		Taxi taxi = booking.getTaxi();
		Driver driver = booking.getDriver();

		// Mark taxi and driver as available again
		taxi.setAvailability(true);
		driver.setAvailability(true);

		taxiRepository.save(taxi);
		driverRepository.save(driver);

		// Return the updated booking as DTO
		return bookingMapper.entityToDto(booking);
	}

	/**
	 * Calculates the fare for a booking based on the distance and price per km of
	 * the taxi.
	 * 
	 * @param booking The booking details.
	 * @return The calculated fare.
	 */
	private BigDecimal calculateFare(Booking booking) {
		BigDecimal pricePerKm = booking.getTaxi().getPricePerKm();
		float distance = booking.getDistance();
		return BigDecimal.valueOf(distance).multiply(pricePerKm);
	}

	/**
	 * Cancels the booking and marks the taxi and driver as available again.
	 * 
	 * @param bookingId The booking ID.
	 * @return The updated booking as a DTO.
	 */
	@Override
	public BookingDTO cancelBooking(Long bookingId) {
		Optional.ofNullable(bookingId)
				.orElseThrow(() -> new IllegalArgumentException(LiteralConstant.BOOKING_DETAILS_ERROR_STRING));

		return bookingRepository.findById(bookingId).map(booking -> {
			// Check if the ride is already started or completed
			if (booking.getStatus().equals(BookingStatus.BOOKING_IN_PROGRESS)
					|| booking.getStatus().equals(BookingStatus.BOOKING_COMPLETED)
					|| booking.getStatus().equals(BookingStatus.BOOKING_DEPARTED)) {
				throw new ResourceNotFoundException("Ride is Already In Progress");
			}
			// Cancel the booking and update payment status
			booking.setStatus(BookingStatus.BOOKING_CANCELLED);
			booking.setUpdatedAt(LocalDateTime.now());
			booking.getPayment().setPaymentStatus(BookingStatus.PAYMENT_CANCELLED);
			booking.getPayment().setPaymentMethod(BookingStatus.PAYMENT_CANCELLED);
			booking.getPayment().setPaymentTime(null);

			bookingRepository.save(booking);

			// Mark taxi and driver as available again
			Taxi taxi = booking.getTaxi();
			taxi.setAvailability(true);
			taxiRepository.save(taxi);

			Driver driver = booking.getDriver();
			driver.setAvailability(true);
			driverRepository.save(driver);

			return bookingMapper.entityToDto(booking);

		}).orElseThrow(() -> new ResourceNotFoundException(LiteralConstant.BOOKING_ID_ERROR_STRING + bookingId));
	}

	/**
	 * Retrieves the booking history for a customer.
	 * 
	 * @param userId The customer ID.
	 * @return A list of BookingDTOs representing the customer's booking history.
	 */
	@Override
	public List<BookingDTO> getBookingHistory(Long userId) {
		Optional.ofNullable(userId).orElseThrow(() -> new IllegalArgumentException("UserId can't be null"));

		List<Booking> bookings = bookingRepository.findByUserUserId(userId);
		return bookings.stream().map(bookingMapper::entityToDto).toList();
	}

	/**
	 * Assigns a taxi to the booking based on the car model.
	 * 
	 * @param model The taxi model.
	 * @return The assigned taxi.
	 */
	public synchronized Taxi assignTaxiToBooking(String model) {
		Optional.ofNullable(model).orElseThrow(() -> new IllegalArgumentException("Taxi Model can't be null"));

		List<Taxi> availableTaxis = taxiRepository.findByModelAndAvailability(model, true);
		if (!availableTaxis.isEmpty()) {
			return availableTaxis.get(0);
		}
		throw new ResourceNotAvailableException("No available taxi found for model: " + model);
	}

	/**
	 * Assigns an available driver to the taxi.
	 * 
	 * @return The assigned driver.
	 */
	public synchronized Driver assignDriverToTaxi() {
		List<Driver> availableDrivers = driverRepository.findAll();
		return availableDrivers.stream()
				.filter(driver -> Boolean.TRUE.equals(driver.getAvailability())
						&& Boolean.TRUE.equals(driver.getUser().isLoggedIn()))
				.findFirst().orElseThrow(() -> new ResourceNotAvailableException("No available driver found."));

	}

	/**
	 * Retrieves the booking history for a driver.
	 * 
	 * @param driverId The driver ID.
	 * @return A list of BookingDTOs representing the driver's booking history.
	 */
	@Override
	public List<BookingDTO> getDriverBookingHistory(Long driverId) {
		Optional.ofNullable(driverId)
				.orElseThrow(() -> new IllegalArgumentException(LiteralConstant.DRIVER_ID_ERROR_STRING));

		List<Booking> bookings = bookingRepository.findByDriverDriverId(driverId);
		return bookings.stream().map(bookingMapper::entityToDto).toList();
	}

	/**
	 * Retrieves a booking by its ID.
	 * 
	 * @param bookingId The booking ID.
	 * @return The booking as a DTO.
	 */
	@Override
	public BookingDTO getBookingById(Long bookingId) {
		Optional.ofNullable(bookingId)
				.orElseThrow(() -> new IllegalArgumentException(LiteralConstant.BOOKING_DETAILS_ERROR_STRING));

		return bookingRepository.findById(bookingId).map(bookingMapper::entityToDto)
				.orElseThrow(() -> new ResourceNotFoundException(LiteralConstant.BOOKING_ID_ERROR_STRING + bookingId));
	}

	/**
	 * Retrieves the confirmed booking for a customer based on their ID.
	 * 
	 * @param customerId The customer ID.
	 * @return The confirmed booking as a DTO.
	 */
	@Override
	public BookingDTO getBookingByCustomerIdAndStatusConfirmed(Long customerId) {
		Optional.ofNullable(customerId).orElseThrow(() -> new IllegalArgumentException("CustomerId can't be null"));

		return bookingRepository.findFirstByUserUserIdAndStatusNotIn(customerId, BookingStatus.getExcludedStatus())
				.map(bookingMapper::entityToDto).orElseThrow(() -> new ResourceNotFoundException(
						"No confirmed booking found for customer ID: " + customerId));
	}

	/**
	 * Retrieves the confirmed booking for a driver based on their ID.
	 * 
	 * @param driverId The driver ID.
	 * @return The confirmed booking as a DTO.
	 */
	@Override
	public BookingDTO getBookingByDriverIdAndStatusConfirmed(Long driverId) {
		Optional.ofNullable(driverId)
				.orElseThrow(() -> new IllegalArgumentException(LiteralConstant.DRIVER_ID_ERROR_STRING));
		return bookingRepository.findFirstByDriverDriverIdAndStatusNotIn(driverId, BookingStatus.getExcludedStatus())
				.map(bookingMapper::entityToDto).orElseThrow(
						() -> new ResourceNotFoundException("No confirmed booking found for driver ID: " + driverId));
	}

	/**
	 * Retrieves all bookings.
	 * 
	 * @return A list of all bookings as DTOs.
	 */
	@Override
	public List<BookingDTO> getAllBooking() {
		List<Booking> bookings = bookingRepository.findAll();
		return bookings.stream().map(bookingMapper::entityToDto).toList();
	}

	/**
	 * Retrieves the total revenue for a driver.
	 * 
	 * @param driverId The driver ID.
	 * @return The total revenue.
	 */
	@Override
	public List<BigDecimal> getDriverMonthlyEarnings(Long driverId) {
		Optional.ofNullable(driverId)
				.orElseThrow(() -> new IllegalArgumentException(LiteralConstant.DRIVER_ID_ERROR_STRING));

		List<Booking> bookings = bookingRepository.findByDriverDriverId(driverId);
		List<BigDecimal> monthlyEarnings = new ArrayList<>(Collections.nCopies(12, BigDecimal.ZERO));
		DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MM");

		bookings.stream().forEach(booking -> {
			int month = Integer.parseInt(booking.getCreatedAt().format(monthFormatter)) - 1;
			BigDecimal earning = booking.getStatus().equals("Cancelled") ? BigDecimal.valueOf(0) : booking.getPayment().getAmount();

			monthlyEarnings.set(month, monthlyEarnings.get(month).add(earning));
		});

		return monthlyEarnings;
	}

	@Override
	public List<BookingHistroyDTO> getAllBookingHistory() {
		List<Booking> bookings = bookingRepository.findAll();
		return BookingMapper.toDTOList(bookings);
	}
}

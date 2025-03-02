package com.endava.backend.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.endava.backend.constant.BookingStatus;
import com.endava.backend.dtos.BookingDTO;
import com.endava.backend.dtos.BookingReqDTO;
import com.endava.backend.dtos.UserDTO;
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
import com.endava.backend.service.UserService;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

	@Mock
	private BookingRepo bookingRepository;
	@Mock
	private BookingMapper bookingMapper;
	@Mock
	private TaxiRepo taxiRepository;
	@Mock
	private DriverRepo driverRepository;
	@Mock
	private UserService userService;
	@Mock
	private UserMapper userMapper;

	@InjectMocks
	private BookingServiceImpl bookingService;

	private BookingReqDTO bookingReqDTO;
	private Booking booking;

	@BeforeEach
	void setUp() {
		bookingReqDTO = BookingReqDTO.builder().userId(1L).carModel("Sedan").build();

		User user = User.builder().userId(1L).isLoggedIn(true).build();
		Taxi taxi = Taxi.builder().taxiId(1L).availability(true).pricePerKm(BigDecimal.TEN).build();
		Driver driver = Driver.builder().driverId(1L).availability(true).user(user).build();

		booking = Booking.builder().bookingId(1L).user(user).taxi(taxi).driver(driver)
				.status(BookingStatus.BOOKING_CONFIRMED).distance(5).payment(new Payment()).build();
	}

	@Test
	void createBooking_Success() {
		doReturn(UserDTO.builder().userId(1L).build()).when(userService).getUserById(1L);
		doReturn(new User()).when(userMapper).dtoToEntity(any());

		doReturn(List.of(booking.getTaxi())).when(taxiRepository).findByModelAndAvailability("Sedan", true);
		doReturn(List.of(booking.getDriver())).when(driverRepository).findAll();
		doReturn(booking).when(bookingMapper).reqDtoToEntity(any());
		doReturn(booking).when(bookingRepository).save(any());
		doReturn(new BookingDTO()).when(bookingMapper).entityToDto(any());

		BookingDTO result = bookingService.createBooking(bookingReqDTO);

		assertNotNull(result);
		verify(bookingRepository).save(any());
		verify(taxiRepository).save(any());
		verify(driverRepository).save(any());
	}

	@Test
	void createBooking_NoAvailableDriver() {
		doReturn(UserDTO.builder().userId(1L).build()).when(userService).getUserById(1L);
		doReturn(List.of(booking.getTaxi())).when(taxiRepository).findByModelAndAvailability("Sedan", true);
		doReturn(List.of()).when(driverRepository).findAll();

		var exception = assertThrows(ResourceNotAvailableException.class,
				() -> bookingService.createBooking(bookingReqDTO));

		assertEquals("No available driver found.", exception.getMessage());
	}

	@Test
	void createBooking_NoAvailableTaxi() {
		doReturn(UserDTO.builder().userId(1L).build()).when(userService).getUserById(1L);
		doReturn(List.of()).when(taxiRepository).findByModelAndAvailability("Sedan", true);

		assertThrows(ResourceNotAvailableException.class, () -> bookingService.createBooking(bookingReqDTO));

	}
	
	@Test
	void cancelBooking_CannotCancelRideInProgrss() {
		booking.setStatus(BookingStatus.BOOKING_IN_PROGRESS);
		when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
		assertThrows(ResourceNotFoundException.class, () -> bookingService.cancelBooking(1L));
	}

	@Test
	void cancelBooking_Success() {
		doReturn(Optional.of(booking)).when(bookingRepository).findById(1L);
		doReturn(new BookingDTO()).when(bookingMapper).entityToDto(any());

		BookingDTO result = bookingService.cancelBooking(1L);

		assertNotNull(result);
		assertEquals(BookingStatus.BOOKING_CANCELLED, booking.getStatus());
		verify(bookingRepository).save(any());
	}

	@Test
	void cancelBooking_BookingNotFound() {
		doReturn(Optional.empty()).when(bookingRepository).findById(1L);
		assertThrows(ResourceNotFoundException.class, () -> bookingService.cancelBooking(1L));
	}

	@Test
	void departBooking_Success() {
		doReturn(Optional.of(booking)).when(bookingRepository).findById(1L);
		doReturn(new BookingDTO()).when(bookingMapper).entityToDto(any());

		BookingDTO result = bookingService.departBooking(1L);

		assertNotNull(result);
		assertEquals(BookingStatus.BOOKING_DEPARTED, booking.getStatus());
		verify(bookingRepository).save(any());
	}

	@Test
	void departBooking_BookingNotFound() {
		doReturn(Optional.empty()).when(bookingRepository).findById(1L);
		assertThrows(ResourceNotFoundException.class, () -> bookingService.departBooking(1L));
	}

	@Test
	void departBooking_BookingIsEmpty() {
		assertThrows(IllegalArgumentException.class, () -> bookingService.departBooking(null));
	}
}

package com.endava.backend.service;

import java.math.BigDecimal;
import java.util.List;

import com.endava.backend.dtos.BookingDTO;
import com.endava.backend.dtos.BookingHistroyDTO;
import com.endava.backend.dtos.BookingReqDTO;

public interface BookingService {

    BookingDTO createBooking(BookingReqDTO bookingReqDTO);
    BookingDTO cancelBooking(Long bookingId);
    BookingDTO departBooking(Long bookingId);
    
    BookingDTO rideStarted(Long bookingId,String rideStartOtp);
    BookingDTO completeBooking(Long bookingId,String bookingMethod);
    
    BookingDTO getBookingByCustomerIdAndStatusConfirmed(Long customerId);
    BookingDTO getBookingByDriverIdAndStatusConfirmed(Long driverId);
    List<BookingDTO> getBookingHistory(Long userId);
    List<BookingDTO> getDriverBookingHistory(Long driverId);
    List<BigDecimal> getDriverMonthlyEarnings(Long driverId);
    List<BookingDTO> getAllBooking();
    BookingDTO getBookingById(Long bookingId);
    
    List<BookingHistroyDTO> getAllBookingHistory();
}

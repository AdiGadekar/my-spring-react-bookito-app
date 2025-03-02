package com.endava.backend.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.endava.backend.dtos.BookingDTO;
import com.endava.backend.dtos.BookingHistroyDTO;
import com.endava.backend.dtos.BookingReqDTO;
import com.endava.backend.entities.Booking;
import com.endava.backend.entities.Driver;
import com.endava.backend.entities.Taxi;
import com.endava.backend.entities.User;

@Component
public class BookingMapper {
	
	private PaymentMapper paymentMapper;
	
    public BookingMapper(PaymentMapper paymentMapper) {
		this.paymentMapper = paymentMapper;
	}

	public Booking dtoToEntity(BookingDTO dto) {
        if (dto == null) return null;

       return Booking.builder()
                .bookingId(dto.getBookingId())
                .pickupLocation(dto.getPickupLocation())
                .dropoffLocation(dto.getDropoffLocation())
                .status(dto.getStatus())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .carModel(dto.getCarModel())
                .distance(dto.getDistance())
                .user(User.builder().userId(dto.getUserId()).build())
                .taxi(Taxi.builder().taxiId(dto.getTaxiId()).build())
                .driver(Driver.builder().driverId(dto.getDriverId()).build())
                .payment(paymentMapper.dtoToEntity(dto.getPaymentDTO()))
                .build(); 

    }


    public BookingDTO entityToDto(Booking entity) {
        if (entity == null) return null;

        return BookingDTO.builder()
                .bookingId(entity.getBookingId())
                .userId(entity.getUser().getUserId()) 
                .taxiId(entity.getTaxi().getTaxiId())
                .driverId(entity.getDriver().getDriverId()) 
                .pickupLocation(entity.getPickupLocation())
                .distance(entity.getDistance())
                .dropoffLocation(entity.getDropoffLocation())
                .status(entity.getStatus())
                .carModel(entity.getCarModel())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .paymentDTO(paymentMapper.entityToDto(entity.getPayment()))
                .build();
    }
    
    public Booking reqDtoToEntity(BookingReqDTO bookingReqDTO) {
    	if(bookingReqDTO == null) return null;
    	
    	return Booking.builder()
                .pickupLocation(bookingReqDTO.getPickupLocation())
                .dropoffLocation(bookingReqDTO.getDropoffLocation())
                .status(bookingReqDTO.getStatus())
                .carModel(bookingReqDTO.getCarModel())
                .distance(bookingReqDTO.getDistance())
                .build(); 
    }
    
    
    public static BookingHistroyDTO toDTO(Booking booking) {
        return BookingHistroyDTO.builder()
                .bookingId(booking.getBookingId())
                .pickupLocation(booking.getPickupLocation())
                .dropoffLocation(booking.getDropoffLocation())
                .status(booking.getStatus())
                .distance(booking.getDistance())
                .carModel(booking.getCarModel())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .taxiNumberPlate(booking.getTaxi().getNumberPlate())
                .amount(booking.getPayment().getAmount())
                .paymentMethod(booking.getPayment().getPaymentMethod())
                .paymentStatus(booking.getPayment().getPaymentStatus())
                .driverName(booking.getDriver().getUser().getFirstName() + " " + booking.getDriver().getUser().getLastName())
                .customerName(booking.getUser().getFirstName() + " " + booking.getUser().getLastName())
                .build();
    }

    public static List<BookingHistroyDTO> toDTOList(List<Booking> bookings) {
        return bookings.stream().map(BookingMapper::toDTO).toList();
    }
}

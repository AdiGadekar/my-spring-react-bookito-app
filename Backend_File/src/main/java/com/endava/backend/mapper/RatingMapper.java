package com.endava.backend.mapper;

import org.springframework.stereotype.Component;

import com.endava.backend.dtos.RatingDTO;
import com.endava.backend.entities.Rating;
import com.endava.backend.entities.User;
import com.endava.backend.entities.Booking;
import com.endava.backend.entities.Driver;

@Component
public class RatingMapper {

	public Rating dtoToEntity(RatingDTO dto) {
		if (dto == null)
			return null;

		return Rating.builder().ratingId(dto.getRatingId()).ratingValue(dto.getRatingValue())
				.booking(Booking.builder().bookingId(dto.getBookingId()).build()).customerName(dto.getCustomerName())
				.comment(dto.getComment()).createdAt(dto.getCreatedAt())
				.user(User.builder().userId(dto.getUserId()).build())
				.driver(Driver.builder().driverId(dto.getDriverId()).build()).build();

	}

	public RatingDTO entityToDto(Rating entity) {
		if (entity == null)
			return null;

		return RatingDTO.builder().ratingId(entity.getRatingId()).ratingValue(entity.getRatingValue())
				.customerName(entity.getCustomerName()).comment(entity.getComment()).createdAt(entity.getCreatedAt())
				.userId(entity.getUser().getUserId()).driverId(entity.getDriver().getDriverId()).build();
	}
}

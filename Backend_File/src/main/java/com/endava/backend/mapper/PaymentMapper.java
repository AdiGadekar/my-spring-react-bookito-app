package com.endava.backend.mapper;

import org.springframework.stereotype.Component;

import com.endava.backend.dtos.PaymentDTO;
import com.endava.backend.entities.Booking;
import com.endava.backend.entities.Payment;
import com.endava.backend.entities.User;

@Component
public class PaymentMapper {

    public Payment dtoToEntity(PaymentDTO dto) {
        if (dto == null) return null;

        return Payment.builder()
                .paymentId(dto.getPaymentId())
                .amount(dto.getAmount())
                .paymentStatus(dto.getPaymentStatus())
                .paymentMethod(dto.getPaymentMethod())
                .user(User.builder().userId(dto.getUserId()).build())
                .paymentTime(dto.getPaymentTime())
                .booking(Booking.builder().bookingId(dto.getBookingId()).build())
                .build();	
    }

    public PaymentDTO entityToDto(Payment entity) {
        if (entity == null) return null;

        return PaymentDTO.builder()
                .paymentId(entity.getPaymentId())
                .amount(entity.getAmount())
                .paymentStatus(entity.getPaymentStatus())
                .paymentMethod(entity.getPaymentMethod())
                .paymentTime(entity.getPaymentTime())
                .bookingId(entity.getBooking().getBookingId())
                .userId(entity.getUser().getUserId())
                .build();
    }
}

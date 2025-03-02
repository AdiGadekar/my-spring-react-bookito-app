package com.endava.backend.mapper;

import org.springframework.stereotype.Component;

import com.endava.backend.dtos.DriverDTO;
import com.endava.backend.entities.Driver;
import com.endava.backend.entities.User;

@Component
public class DriverMapper {

    public Driver dtoToEntity(DriverDTO dto) {
        if (dto == null) return null;

        return Driver.builder()
                .driverId(dto.getDriverId())
                .licenseNumber(dto.getLicenseNumber())
                .availability(dto.getAvailability())
                .user(User.builder().userId(dto.getUserId()).build()) 
                .build();
    }

    public DriverDTO entityToDto(Driver entity) {
        if (entity == null) return null;

        return DriverDTO.builder()
                .driverId(entity.getDriverId())
                .licenseNumber(entity.getLicenseNumber())
                .availability(entity.getAvailability())
                .userId(entity.getUser().getUserId()) 
                .build();
    }
}

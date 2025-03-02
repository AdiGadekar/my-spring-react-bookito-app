package com.endava.backend.mapper;

import org.springframework.stereotype.Component;

import com.endava.backend.dtos.TaxiDTO;
import com.endava.backend.entities.Taxi;

@Component
public class TaxiMapper {

    public Taxi dtoToEntity(TaxiDTO dto) {
        if (dto == null) return null;

        return Taxi.builder()
                .taxiId(dto.getTaxiId())
                .numberPlate(dto.getNumberPlate())
                .model(dto.getModel())
                .color(dto.getColor())	
                .pricePerKm(dto.getPricePerKm())
                .availability(dto.getAvailability())
                .createdAt(dto.getCreatedAt())
                .build();
    }

    public TaxiDTO entityToDto(Taxi entity) {
        if (entity == null) return null;

        return TaxiDTO.builder()
                .taxiId(entity.getTaxiId())
                .numberPlate(entity.getNumberPlate())
                .model(entity.getModel())
                .color(entity.getColor())
                .pricePerKm(entity.getPricePerKm())
                .availability(entity.getAvailability())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}

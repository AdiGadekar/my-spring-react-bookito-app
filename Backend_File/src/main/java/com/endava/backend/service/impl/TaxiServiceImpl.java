package com.endava.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.endava.backend.dtos.TaxiDTO;
import com.endava.backend.entities.Taxi;
import com.endava.backend.exception.ResourceNotFoundException;
import com.endava.backend.exception.ResourceNotSavedException;
import com.endava.backend.mapper.TaxiMapper;
import com.endava.backend.repository.TaxiRepo;
import com.endava.backend.service.TaxiService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaxiServiceImpl implements TaxiService {

    private final TaxiRepo taxiRepo;
    private final TaxiMapper taxiMapper;


	/**
     * Registers a new taxi after checking if a taxi with the same license plate
     * already exists. Sets the availability to true and assigns the current time
     * as the creation timestamp.
     * 
     * @param taxiDTO The DTO containing taxi details.
     * @return The registered taxi as a DTO.
     */
    @Override
    public TaxiDTO registerTaxi(TaxiDTO taxiDTO) {
        if(taxiDTO == null) {
        	throw new IllegalArgumentException("Taxi details can't be null");
        }
        taxiRepo.findByNumberPlate(taxiDTO.getNumberPlate()).ifPresent(taxiDetail -> {
            throw new ResourceNotSavedException("A taxi with the same License Plate already exists.");
        });
        Taxi taxi = taxiMapper.dtoToEntity(taxiDTO);
        taxi.setCreatedAt(LocalDateTime.now());
        taxi.setAvailability(true);

        return taxiMapper.entityToDto(Optional.ofNullable(taxiRepo.save(taxi))
                .orElseThrow(() -> new ResourceNotSavedException("Failed to register taxi")));
    }

    /**
     * Updates the details of an existing taxi. The method first checks if the taxi
     * with the provided ID exists and updates its attributes.
     * 
     * @param taxiId  The ID of the taxi to update.
     * @param taxiDTO The DTO containing updated taxi details.
     * @return The updated taxi as a DTO.
     */
    @Override
    public TaxiDTO updateTaxiDetails(Long taxiId, TaxiDTO taxiDTO) {
        Optional.ofNullable(taxiId).orElseThrow(() -> new IllegalArgumentException("Taxi ID can't be null"));
        Optional.ofNullable(taxiDTO).orElseThrow(() -> new IllegalArgumentException("Taxi details can't be null"));

        return taxiRepo.findById(taxiId).map(taxi -> {
            taxi.setModel(taxiDTO.getModel());
            taxi.setColor(taxiDTO.getColor());
            taxi.setPricePerKm(taxiDTO.getPricePerKm());

            return taxiMapper.entityToDto(Optional.ofNullable(taxiRepo.save(taxi))
                    .orElseThrow(() -> new ResourceNotSavedException("Failed to Update taxi")));
        }).orElseThrow(() -> new ResourceNotFoundException("Taxi with ID " + taxiId + " not found."));
    }

    /**
     * Returns a list of all registered taxis.
     * 
     * @return A list of all taxis as DTOs.
     */
    @Override
    public List<TaxiDTO> viewAllTaxis() {
        List<Taxi> taxis = taxiRepo.findAll();
        return taxis.stream().map(taxiMapper::entityToDto).toList();
    }

    /**
     * Returns a list of all available taxis.
     * 
     * @return A list of available taxis as DTOs.
     */
    @Override
    public List<TaxiDTO> viewAllAvilableTaxis() {
        List<Taxi> taxis = taxiRepo.findDistinctAvailableModels();
        return taxis.stream().map(taxiMapper::entityToDto).toList();
    }

    /**
     * Retrieves a taxi by its ID.
     * 
     * @param taxiId The ID of the taxi to retrieve.
     * @return The taxi as a DTO.
     */
    @Override
    public TaxiDTO getTaxiById(Long taxiId) {
        Optional.ofNullable(taxiId).orElseThrow(() -> new IllegalArgumentException("Taxi ID can't be null"));

        return taxiRepo.findById(taxiId).map(taxiMapper::entityToDto).orElseThrow(() -> new ResourceNotFoundException("Taxi with ID " + taxiId + " not found."));
    }
}

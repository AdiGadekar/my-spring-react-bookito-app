package com.endava.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.endava.backend.dtos.DriverDTO;
import com.endava.backend.dtos.UserDTO;
import com.endava.backend.entities.Driver;
import com.endava.backend.exception.ResourceNotFoundException;
import com.endava.backend.mapper.DriverMapper;
import com.endava.backend.mapper.UserMapper;
import com.endava.backend.repository.DriverRepo;
import com.endava.backend.repository.UserRepo;
import com.endava.backend.service.DriverService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final DriverRepo driverRepo;
    private final UserRepo userRepo;
    private final UserMapper userMapper;
    private final DriverMapper driverMapper;
    
    
	/**
     * Retrieves a driver by their ID, along with associated user details.
     * Throws a ResourceNotFoundException if either the driver or the associated user is not found.
     * 
     * @param driverId The ID of the driver to retrieve.
     * @return A UserDTO representing the associated user of the driver.
     */
    @Override
    public UserDTO getDriverById(Long driverId) {
        return driverRepo.findById(driverId).map(driver -> 
            userRepo.findById(driver.getUser().getUserId()).map(userMapper::entityToDto
            ).orElseThrow(() -> 
                new ResourceNotFoundException("User with ID " + driver.getUser().getUserId() + " not found"))
        ).orElseThrow(() -> 
            new ResourceNotFoundException("Driver with ID " + driverId + " not found"));
    }

    /**
     * Retrieves a list of all drivers and converts them into a list of DriverDTOs.
     * 
     * @return A list of DriverDTOs representing all drivers.
     */
    @Override
    public List<DriverDTO> getAllDrivers() {
        List<Driver> drivers = driverRepo.findAll();
        return drivers.stream().map(driverMapper::entityToDto).toList();
        
    }
}

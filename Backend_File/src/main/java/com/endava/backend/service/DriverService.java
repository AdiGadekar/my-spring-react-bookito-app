package com.endava.backend.service;

import java.util.List;

import com.endava.backend.dtos.DriverDTO;
import com.endava.backend.dtos.UserDTO;

public interface DriverService {

	UserDTO getDriverById(Long driverId);

	List<DriverDTO> getAllDrivers();
}

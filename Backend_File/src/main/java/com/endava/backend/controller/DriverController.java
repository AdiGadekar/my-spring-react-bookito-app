package com.endava.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.endava.backend.dtos.UserDTO;
import com.endava.backend.response.ApiResponse;
import com.endava.backend.service.DriverService;

import lombok.RequiredArgsConstructor;

/**
 * Controller for handling driver-related API requests.
 */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

	private final DriverService driverService;

	/**
	 * Retrieves driver details based on the provided driver ID.
	 * 
	 * @param driverId ID of the driver to fetch details for.
	 * @return ResponseEntity containing ApiResponse with UserDTO if found, or an
	 *         error message.
	 */
	@GetMapping("/getDriver")
	public ResponseEntity<ApiResponse<UserDTO>> getDriverById(@RequestParam Long driverId) {
		UserDTO userDTO = driverService.getDriverById(driverId);
		return new ResponseEntity<>(new ApiResponse<>(userDTO), HttpStatus.OK);
	}
}

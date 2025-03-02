package com.endava.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.endava.backend.response.ApiResponse;
import com.endava.backend.websocket.impl.CustomerNotificationImpl;
import com.endava.backend.websocket.impl.DriverNotificationImpl;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/chat")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ChatController {

	private final DriverNotificationImpl driverNotificationImpl;
	private final CustomerNotificationImpl customerNotificationImpl;

	@PostMapping("/forDriver")
	public ResponseEntity<ApiResponse<Boolean>> sendMessageToDriver(@RequestParam Long driverId,
			@RequestParam String textMessage) {
		System.out.println("Here");
		Boolean response = driverNotificationImpl.messageDriver(driverId, textMessage);
		return new ResponseEntity<>(new ApiResponse<>(response), HttpStatus.OK);
	}
	
	
	@PostMapping("/forCustomer")
	public ResponseEntity<ApiResponse<Boolean>> sendMessageToCustomer(@RequestParam Long customerId,
			@RequestParam String textMessage) {
		Boolean response = customerNotificationImpl.messageCustomer(customerId, textMessage);
		return new ResponseEntity<>(new ApiResponse<>(response), HttpStatus.OK);
	}

}

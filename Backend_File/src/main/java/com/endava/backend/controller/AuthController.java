package com.endava.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.endava.backend.response.ApiResponse;
import com.endava.backend.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

   
    private final AuthService authService;  
    
    

	/**
	 * Handles the login procedure for users.
	 * 
	 * @param email    User's email for authentication.
	 * @param password User's password for authentication.
	 * @return ResponseEntity containing ApiResponse.
	 */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Object>> login(@RequestParam String email, @RequestParam String password) {
        Object loginResponse = authService.login(email, password);
        return new ResponseEntity<>(new ApiResponse<>(loginResponse), HttpStatus.OK);
    }

    /**
	 * Handles the logout procedure for a user.
	 * 
	 * @param email Email of the user who wishes to log out.
	 * @return ApiResponse with a message confirming logout.
	 */

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@RequestParam String email) {
        authService.logout(email);
        return new ResponseEntity<>(new ApiResponse<>("User has been logged out."), HttpStatus.OK);
    }

    /**
	 * Handles password reset procedure for a user.
	 * 
	 * @param email User's email to reset password for.
	 * @param newPassword The new password to set for the user.
	 * @return ApiResponse with a message confirming password reset.
	 */
    @PostMapping("/resetPassword")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        authService.resetPassword(email, newPassword);
        return new ResponseEntity<>(new ApiResponse<>("Password reset successfully."), HttpStatus.OK);
    }

    
    /**
	 * Sends an OTP to the user's email for password reset procedure.
	 * 
	 * @param email The email of the user to send the OTP to.
	 * @return ApiResponse with a message confirming OTP sent.
	 */
    @PostMapping("/sendOTP")
    public ResponseEntity<ApiResponse<String>> sendOTP(@RequestParam String email) {
        authService.sendOTP(email);
        return new ResponseEntity<>(new ApiResponse<>("OTP sent successfully."), HttpStatus.OK);
    }

    /**
	 * Validates the OTP entered by the user for password reset.
	 * 
	 * @param email User's email for validation.
	 * @param otp OTP code entered by the user.
	 * @return ApiResponse with a message confirming OTP validation.
	 */

    @PostMapping("/validateOTP")
    public ResponseEntity<ApiResponse<String>> validateOTP(@RequestParam String email, @RequestParam int otp) {
        authService.validateOTP(email, otp);
        return new ResponseEntity<>(new ApiResponse<>("OTP validated successfully."), HttpStatus.OK);
    }
}


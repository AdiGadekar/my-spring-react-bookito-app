package com.endava.backend.service;

public interface AuthService {
	Object login(String username, String password);
	
	void logout(String username);
	
	boolean sendOTP(String username);
	boolean validateOTP(String username,int otp);
	boolean resetPassword(String email, String newPassword);
}

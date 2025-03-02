package com.endava.backend.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;


@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class PasswordUtil {


	private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

	public static String hashPassword(String password) {
		return encoder.encode(password);
	}

	public static boolean checkPassword(String rawPassword, String hashedPassword) {
		return encoder.matches(rawPassword, hashedPassword);
	}
}

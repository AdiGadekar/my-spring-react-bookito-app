package com.endava.backend.exception;

public class EmailCannotBeSent extends RuntimeException {

	public EmailCannotBeSent(String message) {
		super(message);
	}

}

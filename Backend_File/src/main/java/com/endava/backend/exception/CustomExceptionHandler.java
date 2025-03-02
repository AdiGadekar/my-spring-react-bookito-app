package com.endava.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.endava.backend.response.ApiResponse;

/**
 * Global exception handler for managing custom exceptions.
 */
@RestControllerAdvice
public class CustomExceptionHandler {

    /**
     * Handles ResourceNotFoundException and returns a NOT_FOUND status with the error message.
     * 
     * @param exception The exception that was thrown.
     * @return ResponseEntity containing an ApiResponse with the error message and HTTP status NOT_FOUND.
     */
    @ExceptionHandler(value = ResourceNotFoundException.class)	
    public ResponseEntity<ApiResponse<String>> handleResourceNotFound(ResourceNotFoundException exception) {
        return new ResponseEntity<>(new ApiResponse<>(exception.getMessage()), HttpStatus.NOT_FOUND);
    }

    /**
     * Handles EmailCannotBeSent exception and returns a NOT_IMPLEMENTED status with the error message.
     * 
     * @param exception The exception that was thrown.
     * @return ResponseEntity containing an ApiResponse with the error message and HTTP status NOT_IMPLEMENTED.
     */
    @ExceptionHandler(value = EmailCannotBeSent.class)
    public ResponseEntity<ApiResponse<String>> handleEmailNotSent(EmailCannotBeSent exception) {
        return new ResponseEntity<>(new ApiResponse<>(exception.getMessage()), HttpStatus.NOT_IMPLEMENTED);
    }

    /**
     * Handles InvalidCredentialsException and returns an UNAUTHORIZED status with the error message.
     * 
     * @param exception The exception that was thrown.
     * @return ResponseEntity containing an ApiResponse with the error message and HTTP status UNAUTHORIZED.
     */
    @ExceptionHandler(value = InvalidCredentialsException.class)
    public ResponseEntity<ApiResponse<String>> handleInvalidCredential(InvalidCredentialsException exception) {
        return new ResponseEntity<>(new ApiResponse<>(exception.getMessage()), HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handles ResourceNotSavedException and returns a BAD_REQUEST status with the error message.
     * 
     * @param exception The exception that was thrown.
     * @return ResponseEntity containing an ApiResponse with the error message and HTTP status BAD_REQUEST.
     */
    @ExceptionHandler(value = ResourceNotSavedException.class)
    public ResponseEntity<ApiResponse<String>> handleResourceNotSaved(ResourceNotSavedException exception) {
        return new ResponseEntity<>(new ApiResponse<>(exception.getMessage()), HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles ResourceNotAvailableException and returns a NOT_IMPLEMENTED status with the error message.
     * 
     * @param exception The exception that was thrown.
     * @return ResponseEntity containing an ApiResponse with the error message and HTTP status NOT_IMPLEMENTED.
     */
    @ExceptionHandler(value = ResourceNotAvailableException.class)
    public ResponseEntity<ApiResponse<String>> handleResourceNotAvailable(ResourceNotAvailableException exception) {
        return new ResponseEntity<>(new ApiResponse<>(exception.getMessage()), HttpStatus.NOT_IMPLEMENTED);
    }

    /**
     * Handles general exceptions and returns an ACCEPTED status with the error message.
     * 
     * @param exception The exception that was thrown.
     * @return ResponseEntity containing an ApiResponse with the error message and HTTP status ACCEPTED.
     */
    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ApiResponse<String>> handleException(Exception exception) {
        return new ResponseEntity<>(new ApiResponse<>(exception.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(value = TextMessageCannotBeSent.class)
    public ResponseEntity<ApiResponse<String>> handleTextMessageCannotBeSent(TextMessageCannotBeSent exception){
    	return new ResponseEntity<>(new ApiResponse<>(exception.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

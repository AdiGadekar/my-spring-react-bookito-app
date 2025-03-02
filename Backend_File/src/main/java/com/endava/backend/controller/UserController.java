package com.endava.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.endava.backend.dtos.UserDTO;
import com.endava.backend.response.ApiResponse;
import com.endava.backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    /**
     * Registers a new user.
     * 
     * @param userDto The data transfer object containing user details.
     * @return ResponseEntity with ApiResponse containing the registered user or an error message.
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDTO>> registerUser(@RequestBody UserDTO userDto) {
        UserDTO registeredUser = userService.registerUser(userDto);
        return new ResponseEntity<>(new ApiResponse<>(registeredUser), HttpStatus.CREATED);
    }

    /**
     * Updates an existing user's details.
     * 
     * @param userId  The ID of the user to update.
     * @param userDto The data transfer object containing updated user details.
     * @return ResponseEntity with ApiResponse containing the updated user or an error message.
     */
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(@RequestParam Long userId, @RequestBody UserDTO userDto) {
        UserDTO updatedUser = userService.updateUser(userId, userDto);
        return new ResponseEntity<>(new ApiResponse<>(updatedUser), HttpStatus.OK);
    }

    /**
     * Retrieves a list of all drivers.
     * 
     * @return ResponseEntity with ApiResponse containing the list of drivers or an error message.
     */
    @GetMapping("/allDriver")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllDriver() {
        List<UserDTO> drivers = userService.getAllDriver();
        return new ResponseEntity<>(new ApiResponse<>(drivers), HttpStatus.OK);
    }

    /**
     * Retrieves a list of all customers.
     * 
     * @return ResponseEntity with ApiResponse containing the list of customers or an error message.
     */
    @GetMapping("/allCustomer")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllCustomer() {
        List<UserDTO> users = userService.getAllCustomer();
        return new ResponseEntity<>(new ApiResponse<>(users), HttpStatus.OK);
    }

    /**
     * Retrieves a user by their ID.
     * 
     * @param userId The ID of the user to retrieve.
     * @return ResponseEntity with ApiResponse containing the user details or an error message.
     */
    @GetMapping("/getUserById")
    public ResponseEntity<ApiResponse<UserDTO>> getCustomerById(@RequestParam Long userId) {
        UserDTO userDTO = userService.getUserById(userId);
        return new ResponseEntity<>(new ApiResponse<>(userDTO), HttpStatus.OK);
    }

    /**
     * Checks if a user exists by their email.
     * 
     * @param email The email of the user to check.
     * @return ResponseEntity with ApiResponse containing the check result (boolean) or an error message.
     */
    @GetMapping("/checkUser")
    public ResponseEntity<ApiResponse<Boolean>> checkUserByEmail(@RequestParam String email) {
        Boolean response = userService.checkUserByEmail(email);
        return new ResponseEntity<>(new ApiResponse<>(response), HttpStatus.OK);
    }
}

package com.endava.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.endava.backend.constant.LiteralConstant;
import com.endava.backend.constant.RoleCheck;
import com.endava.backend.dtos.UserDTO;
import com.endava.backend.entities.Driver;
import com.endava.backend.entities.User;
import com.endava.backend.exception.ResourceNotFoundException;
import com.endava.backend.exception.ResourceNotSavedException;
import com.endava.backend.mapper.UserMapper;
import com.endava.backend.repository.DriverRepo;
import com.endava.backend.repository.UserRepo;
import com.endava.backend.service.UserService;
import com.endava.backend.utils.PasswordUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepo userRepo;
	private final UserMapper userMapper;
	private final DriverRepo driverRepo;


	/**
	 * Registers a new user after validating the role and ensuring that the email or
	 * license number doesn't already exist.
	 * 
	 * @param userDto DTO representing the user to be registered.
	 * @return A UserDTO representing the successfully registered user.
	 */
	@Override
	public UserDTO registerUser(UserDTO userDto) {

		// Validate the role
		if (!userDto.getRole().equalsIgnoreCase(RoleCheck.ROLE_CUSTOMER)
				&& !userDto.getRole().equalsIgnoreCase(RoleCheck.ROLE_ADMIN)
				&& !userDto.getRole().equalsIgnoreCase(RoleCheck.ROLE_DRIVER)) {
			throw new ResourceNotSavedException("Invalid role. Role must be either 'Customer', 'Admin', or 'Driver'.");
		}

		// Check if the email already exists
		userRepo.findByEmail(userDto.getEmail()).ifPresent(userDetail -> {
			throw new ResourceNotSavedException("Email Id: "+userDto.getEmail()+" already exists!!!");
		});

		// Check if the driver license number already exists (for Driver role)
		if (userDto.getRole().equalsIgnoreCase(RoleCheck.ROLE_DRIVER)) {
			driverRepo.findByLicenseNumber(userDto.getDriverDTO().getLicenseNumber()).ifPresent(driver -> {
				throw new ResourceNotSavedException("A driver with the same license number already exists.");
			});
		}

		// Map DTO to entity and set creation timestamp
		User user = userMapper.dtoToEntity(userDto);
		user.setCreatedAt(LocalDateTime.now());

		// If the role is 'Driver', associate the driver entity with the user
		if (userDto.getRole().equalsIgnoreCase(RoleCheck.ROLE_DRIVER)) {
			Driver driver = user.getDriver();
			driver.setUser(user);
		}

		// Set user as logged out initially and save the user entity
		user.setLoggedIn(false);
		user.setIsActive(true);
		user.setPasswordHash(PasswordUtil.hashPassword(user.getPasswordHash()));
		user = Optional.ofNullable(userRepo.save(user))
				.orElseThrow(() -> new ResourceNotSavedException("User could not be saved."));

		// Remove password hash before returning DTO
		user.setPasswordHash(null);
		return userMapper.entityToDto(user);
	}

	/**
	 * Updates an existing user's details.
	 * 
	 * @param userId  The ID of the user to be updated.
	 * @param userDto The DTO containing updated user details.
	 * @return A UserDTO representing the updated user.
	 */
	@Override
	public UserDTO updateUser(Long userId, UserDTO userDto) {

		// Retrieve the existing user by ID
		User existingUser = userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException(LiteralConstant.USER_ID_ERROR_STRING + userId));

		// If the email remains the same, only update other fields
		if (existingUser.getEmail().equalsIgnoreCase(userDto.getEmail())) {
			existingUser.setFirstName(userDto.getFirstName());
			existingUser.setLastName(userDto.getLastName());
			existingUser.setPhoneNumber(userDto.getPhoneNumber());
			return userMapper.entityToDto(userRepo.save(existingUser));
		} else {
			// If the email changes, check if the new email already exists
			userRepo.findByEmail(userDto.getEmail()).ifPresent(userDetail -> {
				throw new ResourceNotSavedException("Email Id: "+userDto.getEmail()+" already exists!!!");
			});

			// Update the user with the new details
			existingUser.setFirstName(userDto.getFirstName());
			existingUser.setLastName(userDto.getLastName());
			existingUser.setPhoneNumber(userDto.getPhoneNumber());
			existingUser.setEmail(userDto.getEmail());

			User user = Optional.ofNullable(userRepo.save(existingUser))
					.orElseThrow(() -> new ResourceNotSavedException("User could not be saved."));
			user.setPasswordHash(null);
			return userMapper.entityToDto(user);
		}
	}

	/**
	 * Retrieves a user by their ID.
	 * 
	 * @param userId The ID of the user to retrieve.
	 * @return A UserDTO representing the user with the given ID.
	 */
	@Override
	public UserDTO getUserById(Long userId) {
		return userRepo.findById(userId).map(userMapper::entityToDto)
				.orElseThrow(() -> new ResourceNotFoundException(LiteralConstant.USER_ID_ERROR_STRING + userId));
	}

	/**
	 * Retrieves all customers.
	 * 
	 * @return A list of UserDTOs representing all customers.
	 */
	@Override
	public List<UserDTO> getAllCustomer() {
		List<User> users = userRepo.findByRole(RoleCheck.ROLE_CUSTOMER);
		users.stream().forEach(user->user.setPasswordHash(null));
		return userMapper.entitiesToDtos(users);
	}

	/**
	 * Retrieves all drivers.
	 * 
	 * @return A list of UserDTOs representing all drivers.
	 */
	@Override
	public List<UserDTO> getAllDriver() {
		List<User> users = userRepo.findByRole(RoleCheck.ROLE_DRIVER);
		return userMapper.entitiesToDtos(users);
	}

	/**
	 * Checks if a user exists by their email.
	 * 
	 * @param username The email of the user to check.
	 * @return A boolean indicating whether the user exists.
	 */
	@Override
	public Boolean checkUserByEmail(String username) {
		userRepo.findByEmail(username)
				.orElseThrow(() -> new ResourceNotFoundException(LiteralConstant.USER_ID_ERROR_STRING + username));
		return true;
	}

}

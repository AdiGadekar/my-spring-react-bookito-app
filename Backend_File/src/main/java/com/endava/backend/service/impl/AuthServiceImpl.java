package com.endava.backend.service.impl;

import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.endava.backend.constant.LiteralConstant;
import com.endava.backend.emailservices.impl.EmailService;
import com.endava.backend.entities.User;
import com.endava.backend.exception.InvalidCredentialsException;
import com.endava.backend.exception.ResourceNotFoundException;
import com.endava.backend.mapper.UserMapper;
import com.endava.backend.repository.UserRepo;
import com.endava.backend.service.AuthService;
import com.endava.backend.utils.PasswordUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepo userRepo;
    private final UserMapper userMapper;
    private final EmailService emailService;

    private static final Random random = new Random();

    ConcurrentHashMap<String, Integer> otpHashMap = new ConcurrentHashMap<>();
    
    public void checkValidString(String str, String errorMessage) {
        if (str == null || str.trim().isEmpty()) {
            throw new InvalidCredentialsException(errorMessage);
        }
    }


    /**
     * Logs in the user by verifying the username and password. Throws
     * InvalidCredentialsException if the credentials are invalid.
     *
     * @param username the username of the user
     * @param password the password of the user
     * @return the user details in DTO format
     * @throws InvalidCredentialsException if the username or password is incorrect
     */
    @Override
    public Object login(String username, String password) {
        checkValidString(username, LiteralConstant.USERNAME_EMPTY_ERROR_STRING);
        checkValidString(password, "Password cannot be empty");

        User user = userRepo.findByEmail(username.trim())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        Optional.of(validatePassword(user, password)).filter(valid -> valid)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        user.setLoggedIn(true);
        userRepo.save(user);
        return userMapper.entityToDto(user);
    }

    /**
     * Logs out the user by setting the LoggedIn status to false. Throws
     * InvalidCredentialsException if the username doesn't exist.
     *`
     * @param username the username of the user to log out
     * @throws InvalidCredentialsException if the username is not found
     */
    @Override
    public void logout(String username) {
        checkValidString(username, LiteralConstant.USERNAME_EMPTY_ERROR_STRING);

        userRepo.findByEmail(username.trim()).ifPresentOrElse(user -> {
            user.setLoggedIn(false);
            userRepo.save(user);
        }, () -> {
            throw new InvalidCredentialsException("Invalid username");
        });
    }

    /**
     * Resets the password for the user with the specified email. Throws
     * ResourceNotFoundException if the user does not exist.
     *
     * @param email       the email of the user
     * @param newPassword the new password to set
     * @return true if the password is reset successfully
     * @throws ResourceNotFoundException if the user is not found with the specified
     *                                   email
     */
    @Override
    public boolean resetPassword(String email, String newPassword) {
        checkValidString(email, "Email cannot be empty");
        checkValidString(newPassword, "Password cannot be empty");

        return userRepo.findByEmail(email.trim()).map(user -> {
            user.setPasswordHash(PasswordUtil.hashPassword(newPassword));
            userRepo.save(user);
            return true;
        }).orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    /**
     * Sends an OTP to the user with the specified username. Throws
     * ResourceNotFoundException if the user is not found.
     *
     * @param username the username of the user to send OTP
     * @return true if the OTP is sent successfully
     * @throws ResourceNotFoundException if the user is not found with the specified
     *                                   username
     */
    @Override
    public boolean sendOTP(String username) {
        checkValidString(username, LiteralConstant.USERNAME_EMPTY_ERROR_STRING);

        return userRepo.findByEmail(username.trim()).map(user -> {
            int otp = random.nextInt(9000) + 1000;
            otpHashMap.put(username, otp);
            emailService.sendOTPEmail(user.getEmail(), otp);
            return true;
        }).orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + username));
    }

    /**
     * Validates the OTP for the user with the specified username. Throws
     * InvalidCredentialsException if the OTP is invalid or not found.
     *
     * @param username the username of the user to validate OTP
     * @param otp      the OTP to validate
     * @return true if the OTP is valid
     * @throws InvalidCredentialsException if the OTP is invalid or the username is
     *                                     incorrect
     */
    @Override
    public boolean validateOTP(String username, int otp) {
    	 checkValidString(username, LiteralConstant.USERNAME_EMPTY_ERROR_STRING);
        Optional.ofNullable(otpHashMap.get(username)).filter(storedOtp -> storedOtp == otp)
                .ifPresentOrElse(storedOtp -> otpHashMap.remove(username), () -> {
                    throw new InvalidCredentialsException("Invalid OTP provided");
                });
        return true;
    }

    public boolean validatePassword(User user, String password) {
        if (user == null || password == null || password.trim().isEmpty()) {
            throw new InvalidCredentialsException("User or password cannot be null or empty");
        }
        return user.getPasswordHash().equals(password) || PasswordUtil.checkPassword(password, user.getPasswordHash());
    }
}

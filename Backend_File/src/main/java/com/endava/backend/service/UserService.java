package com.endava.backend.service;

import java.util.List;

import com.endava.backend.dtos.UserDTO;

public interface UserService {
    
    UserDTO registerUser(UserDTO userDto);
    UserDTO updateUser(Long userId, UserDTO userDto);
    UserDTO getUserById(Long userId);
    Boolean checkUserByEmail(String username);
    List<UserDTO> getAllCustomer(); 
    List<UserDTO> getAllDriver();
}

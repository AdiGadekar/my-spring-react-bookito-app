package com.endava.backend.dtos;

import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class UserDTO {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String passwordHash;
    private String phoneNumber;
    private String role; 
    private LocalDateTime createdAt;
    private DriverDTO driverDTO;
	private boolean isLoggedIn;

}

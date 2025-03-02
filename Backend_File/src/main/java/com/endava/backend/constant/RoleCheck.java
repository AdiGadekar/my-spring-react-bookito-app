package com.endava.backend.constant;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;

//Static class for role validation constants
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class RoleCheck{	
    public static final String ROLE_DRIVER = "Driver";
    public static final String ROLE_CUSTOMER = "Customer";
    public static final String ROLE_ADMIN = "Admin";
}
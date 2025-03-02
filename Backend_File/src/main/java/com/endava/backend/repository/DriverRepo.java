package com.endava.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.endava.backend.entities.Driver;

@Repository
public interface DriverRepo extends JpaRepository<Driver, Long> {

    // Find a driver by their license number
    Optional<Driver> findByLicenseNumber(String licenseNumber);

    // Find a driver by the associated user's user ID
    Driver findByUserUserId(Long userId);

}

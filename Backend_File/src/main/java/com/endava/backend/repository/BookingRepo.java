package com.endava.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.endava.backend.entities.Booking;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {

    // Find bookings by the user ID
    List<Booking> findByUserUserId(Long userId);

    // Find bookings by the driver ID
    List<Booking> findByDriverDriverId(Long driverId);

    // Find bookings by the taxi ID
    List<Booking> findByTaxiTaxiId(Long taxiId);

    // Find bookings by status (e.g., "Confirmed", "Completed")
    List<Booking> findByStatus(String status);

    // Find the first booking for a user that is not in a list of statuses
    Optional<Booking> findFirstByUserUserIdAndStatusNotIn(Long userId, List<String> statuses);

    // Find the first booking for a driver that is not in a list of statuses
    Optional<Booking> findFirstByDriverDriverIdAndStatusNotIn(Long driverId, List<String> statuses);
}

package com.endava.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.endava.backend.entities.Rating;
import com.endava.backend.entities.User;

@Repository
public interface RatingRepo extends JpaRepository<Rating, Long> {
    List<Rating> findByUser(User user);
    List<Rating> findByDriver_DriverId(Long driverId);
    @Query(value = "SELECT TOP 3 * FROM ratings WHERE driver_id = :driverId ORDER BY created_at DESC", nativeQuery = true)
    List<Rating> findLastThreeByDriver(@Param("driverId") Long driverId);


}

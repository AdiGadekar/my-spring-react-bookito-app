package com.endava.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.endava.backend.entities.Taxi;

@Repository
public interface TaxiRepo extends JpaRepository<Taxi, Long> {
	//Find taxi by model and availability
    List<Taxi> findByModelAndAvailability(String model, Boolean availability);
    
    //Find taxi by licensePlate
    Optional<Taxi> findByNumberPlate(String licensePlate);
    
    //Find distinct available vehicle
    @Query("SELECT t FROM Taxi t WHERE t.id IN (SELECT MIN(t1.taxiId) FROM Taxi t1 WHERE t1.availability = true GROUP BY t1.model)")
    List<Taxi> findDistinctAvailableModels();
    
}
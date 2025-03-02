package com.endava.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.OptionalDouble;

import org.springframework.stereotype.Service;

import com.endava.backend.dtos.RatingDTO;
import com.endava.backend.entities.Rating;
import com.endava.backend.mapper.RatingMapper;
import com.endava.backend.repository.RatingRepo;
import com.endava.backend.service.RatingService;

import lombok.RequiredArgsConstructor;

/**
 * Implementation of the RatingService interface. Handles business logic related
 * to ratings, including saving and retrieving ratings.
 */
@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

	private final RatingRepo ratingRepo;
	private final RatingMapper ratingMapper;

	/**
	 * Rates a driver by saving a new rating to the database.
	 * 
	 * @param ratingDTO The DTO containing rating information.
	 * @return RatingDTO containing the saved rating details.
	 */
	@Override
	public RatingDTO rateDriver(RatingDTO ratingDTO) {
		if (ratingDTO == null || ratingDTO.getRatingValue() < 1 || ratingDTO.getRatingValue() > 5) {
            throw new IllegalArgumentException("Rating value must be between 1 and 5.");
        }
		Rating rating = ratingMapper.dtoToEntity(ratingDTO);
		rating.setCreatedAt(LocalDateTime.now()); 

		Rating savedRating = ratingRepo.save(rating);

		return ratingMapper.entityToDto(savedRating);
	}

	/**
	 * Retrieves the last three ratings for a specific driver.
	 * 
	 * @param driverId The ID of the driver whose ratings are to be fetched.
	 * @return List of RatingDTOs containing the driver's ratings.
	 */
	@Override
	public List<RatingDTO> getDriverRatings(Long driverId) {

		List<Rating> ratings = ratingRepo.findLastThreeByDriver(driverId);

		return ratings.stream().map(ratingMapper::entityToDto).toList();
	}

	/**
	 * Calculates and retrieves the average rating for a specific driver.
	 * 
	 * @param driverId The ID of the driver whose average rating is to be
	 *                 calculated.
	 * @return The average rating for the driver.
	 */
	@Override
	public double getAverageDriverRating(Long driverId) {
		 List<Rating> ratings = ratingRepo.findByDriver_DriverId(driverId);

	        OptionalDouble average = ratings.stream()
	                .mapToInt(Rating::getRatingValue)
	                .average();

	        return average.isPresent() ? Math.round(average.getAsDouble() * 10.0) / 10.0 : 0.0;
	}

	/**
	 * Retrieves all ratings in the system.
	 * 
	 * @return List of RatingDTOs containing all ratings.
	 */
	@Override
	public List<RatingDTO> getAllRatings() {
		List<Rating> ratings = ratingRepo.findAll();

		return ratings.stream().map(ratingMapper::entityToDto).toList();
	}
}

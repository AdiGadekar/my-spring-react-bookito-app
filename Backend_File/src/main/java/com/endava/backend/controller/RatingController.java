package com.endava.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.endava.backend.dtos.RatingDTO;
import com.endava.backend.service.RatingService;


@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "*")
public class RatingController {

    private RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    /**
     * Allows users to rate a driver.
     * 
     * @param ratingDTO Contains rating details to be saved.
     * @return ResponseEntity with the saved RatingDTO and HTTP status CREATED.
     */
    @PostMapping("/rate")
    public ResponseEntity<RatingDTO> rateDriver(@RequestBody RatingDTO ratingDTO) {
        RatingDTO savedRating = ratingService.rateDriver(ratingDTO);
        return new ResponseEntity<>(savedRating, HttpStatus.CREATED);
    }

    /**
     * Retrieves all ratings for a specific driver by driver ID.
     * 
     * @param driverId ID of the driver whose ratings are to be fetched.
     * @return ResponseEntity with a list of RatingDTOs and HTTP status OK.
     */
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<RatingDTO>> getDriverRatings(@PathVariable Long driverId) {
        List<RatingDTO> driverRatings = ratingService.getDriverRatings(driverId);
        return new ResponseEntity<>(driverRatings, HttpStatus.OK);
    }

    /**
     * Retrieves the average rating of a driver by their ID.
     * 
     * @param driverId ID of the driver whose average rating is to be calculated.
     * @return ResponseEntity with the average rating as a Double and HTTP status OK.
     */
    @GetMapping("/driver/average/{driverId}")
    public ResponseEntity<Double> getAverageDriverRating(@PathVariable Long driverId) {
        double averageRating = ratingService.getAverageDriverRating(driverId);
        return new ResponseEntity<>(averageRating, HttpStatus.OK);
    }
}

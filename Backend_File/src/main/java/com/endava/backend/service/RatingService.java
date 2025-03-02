package com.endava.backend.service;

import com.endava.backend.dtos.RatingDTO;
import java.util.List;

public interface RatingService {

    RatingDTO rateDriver(RatingDTO ratingDTO);

    List<RatingDTO> getDriverRatings(Long driverId);

    double getAverageDriverRating(Long driverId);
    
    List<RatingDTO>getAllRatings();
}

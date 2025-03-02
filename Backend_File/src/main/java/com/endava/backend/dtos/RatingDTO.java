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
public class RatingDTO {
	private Long bookingId;
    private Long ratingId;
    private Long userId; 
    private Long driverId; 
    private Integer ratingValue;
    private String comment;
    private LocalDateTime createdAt;
    private String customerName;
}

package com.endava.backend.entities;

import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@Entity
@Table(name = "ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ratingId;
    
    @OneToOne
    @JoinColumn(name = "bookingId", nullable = false)  
    private Booking booking;
    
    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)  
    private User user;

    @ManyToOne
    @JoinColumn(name = "driverId", nullable = false)  
    private Driver driver;

    @Column(nullable = false)  
    private Integer ratingValue;

    @Column(nullable = false)
    private String comment;

    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = true)
    private String customerName;

}

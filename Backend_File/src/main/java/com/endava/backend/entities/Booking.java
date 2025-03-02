package com.endava.backend.entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Builder
@Data
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@Entity
@Table(name = "bookings")
public class Booking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long bookingId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "userId", nullable = false)
	private User user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "taxiId", nullable = false)
	private Taxi taxi;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "driverId", nullable = false)
	private Driver driver;

	@Column(nullable = false)
	private String pickupLocation;

	@Column(nullable = false)
	private String dropoffLocation;

	private float distance;

	@Column(nullable = false)
	private String status;

	private String carModel;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	@ToString.Exclude
	@JsonIgnore
	@OneToOne(cascade = CascadeType.ALL, mappedBy = "booking")
	private Payment payment;

}

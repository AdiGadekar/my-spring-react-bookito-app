package com.endava.backend.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@Table(name = "taxis")
public class Taxi {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long taxiId;
	
	@Column(nullable = false)
	private String numberPlate;
	
	@Column(nullable = false)
	private String model;
	
	@Column(nullable = false)
	private String color;
	
	@Column(nullable = false)
	private Boolean availability;
	
	@Column(nullable = false)
	private BigDecimal pricePerKm;
	
	@Column(nullable = false)
	private LocalDateTime createdAt;
}

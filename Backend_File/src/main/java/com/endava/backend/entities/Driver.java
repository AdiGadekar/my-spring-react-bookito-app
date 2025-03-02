package com.endava.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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
@AllArgsConstructor(access = AccessLevel.PACKAGE)// Used By Builder for obj construction
@NoArgsConstructor(access = AccessLevel.PUBLIC)// Req by JPA for entity initialization
@Entity
@Table(name = "drivers")
public class Driver {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long driverId;

	@ToString.Exclude
	@JsonIgnore
	@OneToOne
	@JoinColumn(name = "userId", unique = true)
	private User user;


	@Column(nullable = false, unique = true)
	private String licenseNumber;
	private Boolean availability;

}

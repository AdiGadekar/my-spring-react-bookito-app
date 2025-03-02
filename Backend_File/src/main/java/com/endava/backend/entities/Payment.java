	package com.endava.backend.entities;
	
	import java.math.BigDecimal;
	import java.time.LocalDateTime;
	
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
	
	@Builder
	@Data
	@AllArgsConstructor(access = AccessLevel.PACKAGE)
	@NoArgsConstructor(access = AccessLevel.PUBLIC)
	@Entity
	@Table(name = "payments")
	public class Payment {
	
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long paymentId;
	
	    @OneToOne
	    @JoinColumn(name = "bookingId", nullable = false)  
	    private Booking booking;
	
	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "userId", nullable = false)  
	    private User user;
	    
	    @Column(nullable = false)  
	    private BigDecimal amount;
	
	    private String paymentStatus;
	
	    private String paymentMethod;
	
	    private LocalDateTime paymentTime;
	}

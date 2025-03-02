package com.endava.backend.service;

import java.util.List;

import com.endava.backend.dtos.TaxiDTO;

public interface TaxiService {

	TaxiDTO registerTaxi(TaxiDTO taxiDTO);

	TaxiDTO updateTaxiDetails(Long taxiId, TaxiDTO taxiDTO);

	List<TaxiDTO> viewAllTaxis();

	List<TaxiDTO> viewAllAvilableTaxis();
	
	TaxiDTO getTaxiById(Long id);

}

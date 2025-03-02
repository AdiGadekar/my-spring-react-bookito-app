package com.endava.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.endava.backend.dtos.TaxiDTO;
import com.endava.backend.response.ApiResponse;
import com.endava.backend.service.TaxiService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/taxis")
@RequiredArgsConstructor
public class TaxiController {

    private final TaxiService taxiService;


    /**
     * Registers a new taxi.
     * 
     * @param taxiDTO The taxi details to be registered.
     * @return ResponseEntity containing ApiResponse with the registered taxi details.
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<TaxiDTO>> registerTaxi(@RequestBody TaxiDTO taxiDTO) {
        TaxiDTO savedTaxi = taxiService.registerTaxi(taxiDTO);
        return new ResponseEntity<>(new ApiResponse<>(savedTaxi), HttpStatus.CREATED);
    }

    /**
     * Updates the details of an existing taxi.
     * 
     * @param taxiId  The ID of the taxi to be updated.
     * @param taxiDTO The updated taxi details.
     * @return ResponseEntity containing ApiResponse with the updated taxi details.
     */
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<TaxiDTO>> updateTaxiDetails(@RequestParam Long taxiId, @RequestBody TaxiDTO taxiDTO) {
        TaxiDTO updatedTaxi = taxiService.updateTaxiDetails(taxiId, taxiDTO);
        return new ResponseEntity<>(new ApiResponse<>(updatedTaxi), HttpStatus.OK);
    }

    /**
     * Retrieves all registered taxis.
     * 
     * @return ResponseEntity containing ApiResponse with the list of all taxis.
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<TaxiDTO>>> viewAllTaxis() {
        List<TaxiDTO> taxis = taxiService.viewAllTaxis();
        return new ResponseEntity<>(new ApiResponse<>(taxis), HttpStatus.OK);
    }

    /**
     * Retrieves all available taxis.
     * 
     * @return ResponseEntity containing ApiResponse with the list of all available taxis.
     */
    @GetMapping("/allModel")
    public ResponseEntity<ApiResponse<List<TaxiDTO>>> viewAllAvailableTaxis() {
        List<TaxiDTO> taxis = taxiService.viewAllAvilableTaxis();
        return new ResponseEntity<>(new ApiResponse<>(taxis), HttpStatus.OK);
    }

    /**
     * Retrieves details of a specific taxi.
     * 
     * @param taxiId The ID of the taxi to be fetched.
     * @return ResponseEntity containing ApiResponse with the taxi details.
     */
    @GetMapping("/getTaxi")
    public ResponseEntity<ApiResponse<TaxiDTO>> getTaxi(@RequestParam Long taxiId) {
        TaxiDTO taxiDTO = taxiService.getTaxiById(taxiId);
        return new ResponseEntity<>(new ApiResponse<>(taxiDTO), HttpStatus.OK);
    }
}

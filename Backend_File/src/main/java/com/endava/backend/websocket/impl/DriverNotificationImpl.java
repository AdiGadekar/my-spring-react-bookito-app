package com.endava.backend.websocket.impl;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.endava.backend.constant.LiteralConstant;
import com.endava.backend.dtos.BookingDTO;
import com.endava.backend.exception.TextMessageCannotBeSent;

@Service
public class DriverNotificationImpl {

    private SimpMessagingTemplate messagingTemplate;
    
    public DriverNotificationImpl(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate = messagingTemplate;
	}

	/**
     * Sends a notification to the driver when a new booking is assigned.
     *
     * @param driverId   The ID of the driver receiving the notification.
     * @param bookingDTO The booking details to be sent with the notification.
     */
   
    public void notifyDriverBooking(Long driverId, BookingDTO bookingDTO) {
        String destination = LiteralConstant.WEBSOCKET_DRIVER_LISTEN_ENDPOINT + driverId + "/newBooking";
        messagingTemplate.convertAndSend(destination, bookingDTO);
    }

    /**
     * Sends a notification to the driver when a booking is canceled.
     *
     * @param driverId   The ID of the driver receiving the notification.
     * @param bookingDTO The booking details to be sent with the notification.
     */
   
    public void notifyDriverCancellation(Long driverId, BookingDTO bookingDTO) {
        String destination = LiteralConstant.WEBSOCKET_DRIVER_LISTEN_ENDPOINT + driverId + "/cancel";
        messagingTemplate.convertAndSend(destination, bookingDTO);
    }

    /**
     * Sends a notification to the driver when the payment for a booking is completed.
     *
     * @param driverId   The ID of the driver receiving the notification.
     * @param bookingDTO The booking details to be sent with the notification.
     */
   
    public void notifyDriverPaymentDone(Long driverId, BookingDTO bookingDTO) {
        String destination = LiteralConstant.WEBSOCKET_DRIVER_LISTEN_ENDPOINT + driverId + "/paymentDone";
        messagingTemplate.convertAndSend(destination, bookingDTO);
    }
    
    public Boolean messageDriver(Long driverId,String textMessage) {
    	try {
    		String destinaion = LiteralConstant.WEBSOCKET_DRIVER_LISTEN_ENDPOINT + driverId+"/messageForDriver";
        	messagingTemplate.convertAndSend(destinaion,textMessage);
        	return true;
    	}catch (Exception e) {
    		throw new TextMessageCannotBeSent("Error Sending Messge!! Try after some time!!");
		}
    }
}

package com.endava.backend.websocket.impl;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.endava.backend.constant.LiteralConstant;
import com.endava.backend.dtos.BookingDTO;
import com.endava.backend.exception.TextMessageCannotBeSent;

@Service
public class CustomerNotificationImpl {

	 private SimpMessagingTemplate messagingTemplate;
	    
	    public CustomerNotificationImpl(SimpMessagingTemplate messagingTemplate) {
			this.messagingTemplate = messagingTemplate;
		}
    

	/**
     * Sends a notification to the customer when the driver departs.
     *
     * @param customerId The ID of the customer receiving the notification.
     * @param bookingDTO The booking details to be sent with the notification.
     */
   
    public void notifyCustomerDeparture(Long customerId, BookingDTO bookingDTO) {
        String destination = LiteralConstant.WEBSOCKET_CUSTOMER_LISTEN_ENDPOINT + customerId + "/depart";
        messagingTemplate.convertAndSend(destination, bookingDTO);
    }

    /**
     * Sends a notification to the customer when the ride starts.
     *
     * @param customerId The ID of the customer receiving the notification.
     * @param bookingDTO The booking details to be sent with the notification.
     */
   
    public void notifyCustomerRideStarted(Long customerId, BookingDTO bookingDTO) {
        String destination = LiteralConstant.WEBSOCKET_CUSTOMER_LISTEN_ENDPOINT + customerId + "/started";
        messagingTemplate.convertAndSend(destination, bookingDTO);
    }

    /**
     * Sends a notification to the customer when the driver arrives.
     *
     * @param customerId The ID of the customer receiving the notification.
     */
   
    public void notifyCustomerDriverArrived(Long customerId) {
        String destination = LiteralConstant.WEBSOCKET_CUSTOMER_LISTEN_ENDPOINT + customerId + "/driverArrived";
        messagingTemplate.convertAndSend(destination, "DriverArrived");
    }

    /**
     * Sends a notification to the customer when the ride is completed.
     *
     * @param customerId The ID of the customer receiving the notification.
     */
   
    public void notifyCustomerRideCompletion(Long customerId) {
        String destination = LiteralConstant.WEBSOCKET_CUSTOMER_LISTEN_ENDPOINT + customerId + "/completeRide";
        messagingTemplate.convertAndSend(destination, "Ride Completed");
    }
    
    public Boolean messageCustomer(Long customerId,String textMessage) {
    	try {
    		String destinaion = LiteralConstant.WEBSOCKET_CUSTOMER_LISTEN_ENDPOINT + customerId +"/messageForCustomer";
        	messagingTemplate.convertAndSend(destinaion,textMessage);
        	return true;
    	}catch (Exception e) {
    		throw new TextMessageCannotBeSent("Error Sending Messge!! Try after some time!!");
		}
    }
}

package com.endava.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
    	
    	/**
    	 * Endpoint where Sever can broadcast the messages with help of broker 
    	 * and Client subscribed to that channel can listen.
    	 * */
        config.enableSimpleBroker("/topic");
        
        /**
         * Endpoint where Client can brodcast the messages and Server can listen[Similar like RestAPI]
         * */
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        //Endpoint to establish WebSocket connection
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS().setSessionCookieNeeded(false);
    }
}


package com.endava.backend.emailservices.impl;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.endava.backend.exception.EmailCannotBeSent;

@Service
public class EmailService{

    private JavaMailSender javaMailSender;
    

    public EmailService(JavaMailSender javaMailSender) {
		this.javaMailSender = javaMailSender;
	}



	/**
     * Sends an OTP (One-Time Password) email to the provided email address.
     * 
     * @param toEmail The recipient's email address.
     * @param otp The OTP code to be sent.
     */
   
    public void sendOTPEmail(String toEmail, int otp) {
        try {
        	SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Your OTP Code");
            message.setText("OTP is "+otp);
            javaMailSender.send(message);
        }catch (Exception e) {
			throw new EmailCannotBeSent("Email cannot be send due to some technical error");
		}
    }
}

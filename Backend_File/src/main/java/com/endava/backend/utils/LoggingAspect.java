package com.endava.backend.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

	private static final Logger logger = LogManager.getLogger(LoggingAspect.class);

	// Pointcut to match all controllers and service methods
	@Pointcut("execution(* com.endava.backend.controller..*(..)) || execution(* com.endava.backend.serviceImplementation..*(..))")
	public void loggableMethods() {
	}

	@Before("loggableMethods()")
	public void logBefore(JoinPoint joinPoint) {
		logger.info("Before method: {}", joinPoint.getSignature().getName());
	}

	@After("loggableMethods()")
	public void logAfter(JoinPoint joinPoint) {
		logger.info("After method: {}", joinPoint.getSignature().getName());
	}

	@AfterReturning(pointcut = "loggableMethods()", returning = "result")
	public void logAfterReturning(JoinPoint joinPoint, Object result) {
		logger.info("Method {} returned: {}", joinPoint.getSignature().getName(), result);
	}

	@AfterThrowing(pointcut = "loggableMethods()", throwing = "exception")
	public void logAfterThrowing(JoinPoint joinPoint, Throwable exception) {
		logger.error("Method {} threw exception: {}", joinPoint.getSignature().getName(), exception.getMessage());
	}

}

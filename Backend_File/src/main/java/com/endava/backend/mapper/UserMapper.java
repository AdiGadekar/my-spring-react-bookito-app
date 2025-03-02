package com.endava.backend.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.endava.backend.dtos.UserDTO;
import com.endava.backend.entities.User;
import java.util.Collections;

@Component
public class UserMapper {
	private DriverMapper driverMapper;
	

	public UserMapper(DriverMapper driverMapper) {
		super();
		this.driverMapper = driverMapper;
	}

	public User dtoToEntity(UserDTO dto) {
		if (dto == null)
			return null;

		return User.builder().userId(dto.getUserId()).firstName(dto.getFirstName()).lastName(dto.getLastName())
				.email(dto.getEmail()).phoneNumber(dto.getPhoneNumber()).passwordHash(dto.getPasswordHash())
				.role(dto.getRole()).createdAt(dto.getCreatedAt()).driver(driverMapper.dtoToEntity(dto.getDriverDTO()))
				.isLoggedIn(dto.isLoggedIn()).build();

	}

	public UserDTO entityToDto(User entity) {
		if (entity == null)
			return null;

		return UserDTO.builder().userId(entity.getUserId()).firstName(entity.getFirstName())
				.lastName(entity.getLastName()).passwordHash(entity.getPasswordHash()).email(entity.getEmail())
				.phoneNumber(entity.getPhoneNumber()).role(entity.getRole()).createdAt(entity.getCreatedAt())
				.driverDTO(driverMapper.entityToDto(entity.getDriver())).isLoggedIn(entity.isLoggedIn()).build();
	}

	public List<UserDTO> entitiesToDtos(List<User> entities) {
		if (entities == null)
			return Collections.emptyList();

		return entities.stream().map(this::entityToDto).toList();
	}
}

package com.endava.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.endava.backend.entities.User;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    // Find a user by their email
    Optional<User> findByEmail(String email);

    // Find users by their role (e.g., customer, admin)
    List<User> findByRole(String role);
}

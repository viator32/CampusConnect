package com.clubhub.service;

import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import com.clubhub.entity.User;
import com.clubhub.repository.UserRepository;

@ApplicationScoped
public class UserService {

	@Inject
	UserRepository userRepository;

	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	public User getUserById(UUID id) {
		return userRepository.findById(id);
	}

        public User getUserByEmail(String email) {
                return userRepository.findByEmail(email);
        }

        // Password handling and authentication is delegated to Keycloak

	@Transactional
	public void createUser(User user) {
		userRepository.save(user);
	}

	@Transactional
	public User updateUser(User user) {
		return userRepository.update(user);
	}

	@Transactional
	public void deleteUser(UUID id) {
		userRepository.delete(id);
	}

}

package com.clubhub.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
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

        private String hash(String password) {
                try {
                        MessageDigest md = MessageDigest.getInstance("SHA-256");
                        byte[] hashed = md.digest(password.getBytes(StandardCharsets.UTF_8));
                        return Base64.getEncoder().encodeToString(hashed);
                } catch (NoSuchAlgorithmException e) {
                        throw new RuntimeException(e);
                }
        }

        @Transactional
        public void createUser(User user, String password) {
                user.setPasswordHash(hash(password));
                userRepository.save(user);
        }

        public User authenticate(String email, String password) {
                User user = getUserByEmail(email);
                if (user == null) {
                        return null;
                }
                String hashed = hash(password);
                if (hashed.equals(user.getPasswordHash())) {
                        return user;
                }
                return null;
        }

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

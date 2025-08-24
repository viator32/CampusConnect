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
import org.eclipse.microprofile.config.inject.ConfigProperty;

import com.clubhub.entity.User;
import com.clubhub.entity.dto.UserDTO;
import com.clubhub.entity.mapper.UserMapper;
import com.clubhub.exception.ClubHubErrorCode;
import com.clubhub.exception.ErrorPayload;
import com.clubhub.exception.NotFoundException;
import com.clubhub.exception.UnauthorizedException;
import com.clubhub.repository.EventRepository;
import com.clubhub.repository.PostRepository;
import com.clubhub.repository.UserRepository;

@ApplicationScoped
public class UserService {

        @Inject
        UserRepository userRepository;

        @Inject
        EventRepository eventRepository;

    @Inject
    PostRepository postRepository;

    @Inject
    ObjectStorageService objectStorageService;


        @ConfigProperty(name = "auth.pepper")
        String pepper;

        public List<User> getAllUsers() {
                return userRepository.findAll();
        }

        public List<UserDTO> getAllUserProfiles() {
                return userRepository.findAll().stream().map(u -> {
                        UserDTO dto = UserMapper.toDTO(u);
                        dto.eventsAttended = eventRepository.countEventsAttendedByUser(u.getId());
                        dto.postsCreated = postRepository.countPostsByAuthor(u.getId());
                        return dto;
                }).toList();
        }

        public User getUserById(UUID id) {
                User user = userRepository.findById(id);
                if (user == null) {
                        throw new NotFoundException(ErrorPayload.builder()
                                        .errorCode(ClubHubErrorCode.USER_NOT_FOUND)
                                        .title("User not found")
                                        .details("No user with id %s exists.".formatted(id))
                                        .messageParameter("userId", id.toString())
                                        .sourcePointer("userId")
                                        .build());
                }
                return user;
        }

        public UserDTO getUserProfile(UUID id) {
                User user = getUserById(id);
                UserDTO dto = UserMapper.toDTO(user);
                dto.eventsAttended = eventRepository.countEventsAttendedByUser(id);
                dto.postsCreated = postRepository.countPostsByAuthor(user.getId());
                return dto;
        }

        public User getUserByEmail(String email) {
                return userRepository.findByEmail(email);
        }

        private String hash(String password) {
                try {
                        MessageDigest md = MessageDigest.getInstance("SHA-256");
                        byte[] hashed = md.digest((password + pepper).getBytes(StandardCharsets.UTF_8));
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
                        throw new UnauthorizedException(ErrorPayload.builder()
                                        .errorCode(ClubHubErrorCode.INVALID_CREDENTIALS)
                                        .title("Invalid credentials")
                                        .details("Email or password is incorrect.")
                                        .messageParameter("email", email)
                                        .sourcePointer("email")
                                        .build());
                }
                String hashed = hash(password);
                if (hashed.equals(user.getPasswordHash())) {
                        return user;
                }
                throw new UnauthorizedException(ErrorPayload.builder()
                                .errorCode(ClubHubErrorCode.INVALID_CREDENTIALS)
                                .title("Invalid credentials")
                                .details("Email or password is incorrect.")
                                .messageParameter("email", email)
                                .sourcePointer("password")
                                .build());
        }


        @Transactional
        public User updateUserProfile(User user) {
                User existing = getUserById(user.getId());
                if (user.getEmail() != null) {
                        existing.setEmail(user.getEmail());
                }
                if (user.getUsername() != null) {
                        existing.setUsername(user.getUsername());
                }
                if (user.getAvatar() != null) {
                        existing.setAvatar(user.getAvatar());
                }
                if (user.getDescription() != null) {
                        existing.setDescription(user.getDescription());
                }
               if (user.getPreferences() != null) {
                       existing.setPreferences(user.getPreferences());
               }
                if (user.getSubject() != null) {
                        existing.setSubject(user.getSubject());
                }
                return userRepository.update(existing);
        }

    @Transactional
    public void updateAvatar(UUID id, byte[] avatar) {
        User existing = getUserById(id);
        String url = objectStorageService.upload("users/" + id, avatar, "image/png");
        existing.setAvatar(url);
        userRepository.update(existing);
    }

       @Transactional
       public void changePassword(UUID id, String currentPassword, String newPassword) {
                User existing = getUserById(id);
                String currentHash = hash(currentPassword);
                if (!existing.getPasswordHash().equals(currentHash)) {
                        throw new UnauthorizedException(ErrorPayload.builder()
                                        .errorCode(ClubHubErrorCode.INVALID_CREDENTIALS)
                                        .title("Invalid credentials")
                                        .details("Current password is incorrect.")
                                        .messageParameter("userId", id.toString())
                                        .sourcePointer("currentPassword")
                                        .build());
                }
                existing.setPasswordHash(hash(newPassword));
                userRepository.update(existing);
        }

        @Transactional
        public void deleteUser(UUID id) {
                User user = userRepository.findById(id);
                if (user == null) {
                        throw new NotFoundException(ErrorPayload.builder()
                                        .errorCode(ClubHubErrorCode.USER_NOT_FOUND)
                                        .title("User not found")
                                        .details("No user with id %s exists.".formatted(id))
                                        .messageParameter("userId", id.toString())
                                        .sourcePointer("userId")
                                        .build());
                }
                userRepository.delete(id);
        }

}

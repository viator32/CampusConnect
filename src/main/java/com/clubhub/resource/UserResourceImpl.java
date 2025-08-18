package com.clubhub.resource;

import java.util.List;
import java.util.UUID;

import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;

import com.clubhub.entity.dto.UserDTO;
import com.clubhub.entity.mapper.UserMapper;
import com.clubhub.service.UserService;
import com.clubhub.entity.dto.ActionResponseDTO;

public class UserResourceImpl implements UserResource {

	@Inject
	UserService userService;

	@Override
        public List<UserDTO> getAll() {
                return userService.getAllUserProfiles();
        }

	@Override
        public UserDTO getCurrent(@Context ContainerRequestContext ctx) {
                UUID userId = (UUID) ctx.getProperty("userId");
                return userService.getUserProfile(userId);
        }

	@Override
        public UserDTO getById(UUID id) {
                return userService.getUserProfile(id);
        }

        @Override
        public UserDTO update(UUID id, UserDTO userDto) {
                var entity = UserMapper.toEntity(userDto);
                entity.setId(id);
                userService.updateUser(entity);
                return userService.getUserProfile(id);
        }

        @Override
        public UserDTO updateAvatar(UUID id, UserDTO userDto) {
                userService.updateAvatar(id, userDto.avatar);
                return userService.getUserProfile(id);
        }

        @Override
        public UserDTO updateDescription(UUID id, UserDTO userDto) {
                userService.updateDescription(id, userDto.description);
                return userService.getUserProfile(id);
        }

        @Override
        public UserDTO updatePreference(UUID id, UserDTO userDto) {
                userService.updatePreference(id, userDto.preference);
                return userService.getUserProfile(id);
        }

        @Override
        public UserDTO updateSubject(UUID id, UserDTO userDto) {
                userService.updateSubject(id, userDto.subject);
                return userService.getUserProfile(id);
        }

	@Override
        public ActionResponseDTO delete(UUID id) {
                userService.deleteUser(id);
                return new ActionResponseDTO(true, "User deleted");
        }
}

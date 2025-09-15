package com.clubhub.resource;

import java.util.List;
import java.util.UUID;

import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;

import com.clubhub.entity.dto.ActionResponseDTO;
import com.clubhub.entity.dto.UserDTO;
import com.clubhub.entity.dto.UserPasswordUpdateDTO;
import com.clubhub.entity.dto.UserUpdateDTO;
import com.clubhub.entity.mapper.UserMapper;
import com.clubhub.service.UserService;

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
	public UserDTO update(UUID id, UserUpdateDTO userDto) {
		var entity = UserMapper.toEntity(userDto);
		entity.setId(id);
		userService.updateUserProfile(entity);
		return userService.getUserProfile(id);
	}

	@Override
	public UserDTO updateAvatar(UUID id, byte[] avatar, String contentType) {
		userService.updateAvatar(id, avatar, contentType);
		return userService.getUserProfile(id);
	}

	@Override
	public ActionResponseDTO updatePassword(UUID id, UserPasswordUpdateDTO passwordDto) {
		userService.changePassword(id, passwordDto.getCurrentPassword(), passwordDto.getNewPassword());
		return new ActionResponseDTO(true, "Password updated");
	}

	@Override
	public ActionResponseDTO delete(UUID id) {
		userService.deleteUser(id);
		return new ActionResponseDTO(true, "User deleted");
	}
}

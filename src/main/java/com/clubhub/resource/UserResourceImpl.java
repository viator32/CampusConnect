package com.clubhub.resource;

import java.util.List;
import java.util.UUID;

import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;

import com.clubhub.entity.dto.UserDTO;
import com.clubhub.entity.mapper.UserMapper;
import com.clubhub.service.UserService;

public class UserResourceImpl implements UserResource {

	@Inject
	UserService userService;

	@Override
        public List<UserDTO> getAll() {
                return userService.getAllUsers().stream()
                                .map(UserMapper::toDTO)
                                .toList();
        }

        @Override
        public Response getCurrent(@Context ContainerRequestContext ctx) {
                UUID userId = (UUID) ctx.getProperty("userId");
                var user = userService.getUserById(userId);
                return user != null ? Response.ok(UserMapper.toDTO(user)).build()
                                : Response.status(Response.Status.NOT_FOUND).build();
        }

	@Override
	public Response getById(UUID id) {
		var user = userService.getUserById(id);
		return user != null ? Response.ok(UserMapper.toDTO(user)).build()
				: Response.status(Response.Status.NOT_FOUND).build();
	}


	@Override
	public Response update(UUID id, UserDTO userDto) {
		var entity = UserMapper.toEntity(userDto);
		entity.setId(id);
		var updated = userService.updateUser(entity);
		return Response.status(Response.Status.OK).entity(updated).build();
	}

	@Override
	public Response delete(UUID id) {
		userService.deleteUser(id);
		return Response.status(Response.Status.NO_CONTENT).build();
	}
}

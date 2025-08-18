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
                return userService.getAllUserProfiles();
        }

	@Override
	public Response getCurrent(@Context ContainerRequestContext ctx) {
                UUID userId = (UUID) ctx.getProperty("userId");
                var user = userService.getUserProfile(userId);
                return Response.ok(user).build();
        }

	@Override
	public Response getById(UUID id) {
                var user = userService.getUserProfile(id);
                return Response.ok(user).build();
        }

        @Override
        public Response update(UUID id, UserDTO userDto) {
                var entity = UserMapper.toEntity(userDto);
                entity.setId(id);
                userService.updateUser(entity);
                var updatedDto = userService.getUserProfile(id);
                return Response.status(Response.Status.OK).entity(updatedDto).build();
        }

        @Override
        public Response updateAvatar(UUID id, UserDTO userDto) {
                userService.updateAvatar(id, userDto.avatar);
                var updatedDto = userService.getUserProfile(id);
                return Response.status(Response.Status.OK).entity(updatedDto).build();
        }

        @Override
        public Response updateDescription(UUID id, UserDTO userDto) {
                userService.updateDescription(id, userDto.description);
                var updatedDto = userService.getUserProfile(id);
                return Response.status(Response.Status.OK).entity(updatedDto).build();
        }

        @Override
        public Response updatePreference(UUID id, UserDTO userDto) {
                userService.updatePreference(id, userDto.preference);
                var updatedDto = userService.getUserProfile(id);
                return Response.status(Response.Status.OK).entity(updatedDto).build();
        }

        @Override
        public Response updateSubject(UUID id, UserDTO userDto) {
                userService.updateSubject(id, userDto.subject);
                var updatedDto = userService.getUserProfile(id);
                return Response.status(Response.Status.OK).entity(updatedDto).build();
        }

	@Override
	public Response delete(UUID id) {
		userService.deleteUser(id);
		return Response.status(Response.Status.NO_CONTENT).build();
	}
}

package com.clubhub.resource;

import java.util.List;
import java.util.UUID;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;

import com.clubhub.entity.dto.ActionResponseDTO;
import com.clubhub.entity.dto.UserDTO;
import com.clubhub.entity.dto.UserPasswordUpdateDTO;
import com.clubhub.entity.dto.UserUpdateDTO;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface UserResource {

	@GET
	List<UserDTO> getAll();

	@GET
	@Path("/me")
	UserDTO getCurrent(@Context ContainerRequestContext ctx);

	@GET
	@Path("/{id}")
	UserDTO getById(@PathParam("id") UUID id);

        @PUT
        @Path("/{id}")
        UserDTO update(@PathParam("id") UUID id, UserUpdateDTO userDto);

       @PUT
       @Path("/{id}/avatar")
       @Consumes({ MediaType.APPLICATION_OCTET_STREAM, "image/png", "image/jpeg", "image/webp", "image/gif" })
       UserDTO updateAvatar(@PathParam("id") UUID id, byte[] avatar, @HeaderParam("Content-Type") String contentType);

        @PUT
        @Path("/{id}/password")
        ActionResponseDTO updatePassword(@PathParam("id") UUID id, UserPasswordUpdateDTO passwordDto);

        @DELETE
        @Path("/{id}")
        ActionResponseDTO delete(@PathParam("id") UUID id);

}

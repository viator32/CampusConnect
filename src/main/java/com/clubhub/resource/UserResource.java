package com.clubhub.resource;

import java.util.List;
import java.util.UUID;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.clubhub.entity.dto.UserDTO;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface UserResource {

	@GET
	List<UserDTO> getAll();

	@GET
	@Path("/me")
	Response getCurrent(@Context ContainerRequestContext ctx);

	@GET
	@Path("/{id}")
	Response getById(@PathParam("id") UUID id);

        @PUT
        @Path("/{id}")
        Response update(@PathParam("id") UUID id, UserDTO userDto);

        @PUT
        @Path("/{id}/studentId")
        Response updateStudentId(@PathParam("id") UUID id, UserDTO userDto);

        @PUT
        @Path("/{id}/avatar")
        Response updateAvatar(@PathParam("id") UUID id, UserDTO userDto);

        @PUT
        @Path("/{id}/description")
        Response updateDescription(@PathParam("id") UUID id, UserDTO userDto);

        @PUT
        @Path("/{id}/preference")
        Response updatePreference(@PathParam("id") UUID id, UserDTO userDto);

        @PUT
        @Path("/{id}/subject")
        Response updateSubject(@PathParam("id") UUID id, UserDTO userDto);

	@DELETE
	@Path("/{id}")
	Response delete(@PathParam("id") UUID id);

}

package com.clubhub.resource;

import java.util.List;
import java.util.UUID;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.clubhub.entity.dto.ClubDTO;

@Path("/api/clubs")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface ClubResource {

	@GET
	List<ClubDTO> getAll();

	@GET
	@Path("/{id}")
	Response getById(@PathParam("id") UUID id);

	@POST
	Response create(ClubDTO clubDTO);

	@PUT
	@Path("/{id}")
	Response update(@PathParam("id") UUID id, ClubDTO clubDTO);

	@DELETE
	@Path("/{id}")
	Response delete(@PathParam("id") UUID id);

    @POST
    @Path("/{clubId}/join/{userId}")
    public Response joinClub(@PathParam("clubId") UUID clubId, @PathParam("userId") UUID userId);

}

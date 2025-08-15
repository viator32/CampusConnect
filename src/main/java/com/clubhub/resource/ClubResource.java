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
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.clubhub.entity.dto.ClubDTO;
import com.clubhub.entity.dto.EventDTO;
import com.clubhub.entity.dto.PostDTO;
import com.clubhub.entity.dto.MemberDTO;

@Path("/api/clubs")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface ClubResource {

	@GET
	List<ClubDTO> getAll();

	@GET
	@Path("/{id}")
	Response getById(@PathParam("id") UUID id, @Context ContainerRequestContext ctx);

        @POST
        Response create(ClubDTO clubDTO, @Context ContainerRequestContext ctx);

	@PUT
	@Path("/{id}")
	Response update(@PathParam("id") UUID id, ClubDTO clubDTO);

	@DELETE
	@Path("/{id}")
	Response delete(@PathParam("id") UUID id);

        @POST
        @Path("/{clubId}/join")
        Response joinClub(@PathParam("clubId") UUID clubId, @Context ContainerRequestContext ctx);

        @POST
        @Path("/{clubId}/leave")
        Response leaveClub(@PathParam("clubId") UUID clubId, @Context ContainerRequestContext ctx);

        @PUT
        @Path("/{clubId}/members/{memberId}/role")
        Response updateRole(@PathParam("clubId") UUID clubId, @PathParam("memberId") UUID memberId, MemberDTO dto, @Context ContainerRequestContext ctx);

	@GET
	@Path("/{clubId}/posts")
	List<PostDTO> getClubPosts(@PathParam("clubId") UUID clubId, @Context ContainerRequestContext ctx);

        @POST
        @Path("/{clubId}/posts")
        Response createPost(@PathParam("clubId") UUID clubId, PostDTO postDTO, @Context ContainerRequestContext ctx);

        @PUT
        @Path("/{clubId}/posts/{postId}")
        Response updatePost(@PathParam("clubId") UUID clubId, @PathParam("postId") UUID postId, PostDTO postDTO, @Context ContainerRequestContext ctx);

        @DELETE
        @Path("/{clubId}/posts/{postId}")
        Response deletePost(@PathParam("clubId") UUID clubId, @PathParam("postId") UUID postId, @Context ContainerRequestContext ctx);

	@GET
	@Path("/{clubId}/events")
	List<EventDTO> getClubEvents(@PathParam("clubId") UUID clubId, @Context ContainerRequestContext ctx);

        @POST
        @Path("/{clubId}/events")
        Response createEvent(@PathParam("clubId") UUID clubId, EventDTO eventDTO, @Context ContainerRequestContext ctx);

        @PUT
        @Path("/{clubId}/events/{eventId}")
        Response updateEvent(@PathParam("clubId") UUID clubId, @PathParam("eventId") UUID eventId, EventDTO eventDTO, @Context ContainerRequestContext ctx);

        @DELETE
        @Path("/{clubId}/events/{eventId}")
        Response deleteEvent(@PathParam("clubId") UUID clubId, @PathParam("eventId") UUID eventId, @Context ContainerRequestContext ctx);

	@POST
	@Path("/{clubId}/events/{eventId}/join")
	Response joinEvent(@PathParam("clubId") UUID clubId, @PathParam("eventId") UUID eventId,
			@Context ContainerRequestContext ctx);

}

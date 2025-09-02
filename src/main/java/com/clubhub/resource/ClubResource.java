package com.clubhub.resource;

import java.util.List;
import java.util.UUID;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;

import com.clubhub.entity.Preference;
import com.clubhub.entity.dto.ActionResponseDTO;
import com.clubhub.entity.dto.ClubDTO;
import com.clubhub.entity.dto.EventDTO;
import com.clubhub.entity.dto.MemberDTO;
import com.clubhub.entity.dto.PostDTO;

import org.jboss.resteasy.reactive.ResponseStatus;

@Path("/api/clubs")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface ClubResource {

        @GET
        List<ClubDTO> getAll(@QueryParam("page") @DefaultValue("0") int page,
                        @QueryParam("size") @DefaultValue("20") int size,
                        @QueryParam("interest") Preference interest,
                        @QueryParam("category") String category,
                        @QueryParam("name") String name,
                        @QueryParam("minMembers") Integer minMembers,
                        @QueryParam("maxMembers") Integer maxMembers);

	@GET
	@Path("/{id}")
	ClubDTO getById(@PathParam("id") UUID id, @Context ContainerRequestContext ctx);

	@POST
	@ResponseStatus(201)
	ClubDTO create(ClubDTO clubDTO, @Context ContainerRequestContext ctx);

        @PUT
        @Path("/{id}")
        ClubDTO update(@PathParam("id") UUID id, ClubDTO clubDTO);

       @PUT
       @Path("/{id}/avatar")
       @Consumes({ MediaType.APPLICATION_OCTET_STREAM, "image/png", "image/jpeg", "image/webp", "image/gif" })
       ClubDTO updateAvatar(@PathParam("id") UUID id, byte[] avatar, @HeaderParam("Content-Type") String contentType);

	@DELETE
	@Path("/{id}")
	ActionResponseDTO delete(@PathParam("id") UUID id);

	@POST
	@Path("/{clubId}/join")
	ActionResponseDTO joinClub(@PathParam("clubId") UUID clubId, @Context ContainerRequestContext ctx);

	@POST
	@Path("/{clubId}/leave")
	ActionResponseDTO leaveClub(@PathParam("clubId") UUID clubId, @Context ContainerRequestContext ctx);

	@PUT
	@Path("/{clubId}/members/{memberId}/role")
	ActionResponseDTO updateRole(@PathParam("clubId") UUID clubId, @PathParam("memberId") UUID memberId, MemberDTO dto,
			@Context ContainerRequestContext ctx);

	@GET
	@Path("/{clubId}/posts")
	List<PostDTO> getClubPosts(@PathParam("clubId") UUID clubId, @Context ContainerRequestContext ctx);

	@POST
	@Path("/{clubId}/posts")
	@ResponseStatus(201)
	PostDTO createPost(@PathParam("clubId") UUID clubId, PostDTO postDTO, @Context ContainerRequestContext ctx);

	@PUT
	@Path("/{clubId}/posts/{postId}")
	PostDTO updatePost(@PathParam("clubId") UUID clubId, @PathParam("postId") UUID postId, PostDTO postDTO,
			@Context ContainerRequestContext ctx);

	@DELETE
	@Path("/{clubId}/posts/{postId}")
	ActionResponseDTO deletePost(@PathParam("clubId") UUID clubId, @PathParam("postId") UUID postId,
			@Context ContainerRequestContext ctx);

	@GET
	@Path("/{clubId}/events")
	List<EventDTO> getClubEvents(@PathParam("clubId") UUID clubId, @Context ContainerRequestContext ctx);

	@GET
	@Path("/{clubId}/events/{eventId}")
	EventDTO getEvent(@PathParam("clubId") UUID clubId, @PathParam("eventId") UUID eventId,
			@Context ContainerRequestContext ctx);

	@POST
	@Path("/{clubId}/events")
	@ResponseStatus(201)
	EventDTO createEvent(@PathParam("clubId") UUID clubId, EventDTO eventDTO, @Context ContainerRequestContext ctx);

	@PUT
	@Path("/{clubId}/events/{eventId}")
	EventDTO updateEvent(@PathParam("clubId") UUID clubId, @PathParam("eventId") UUID eventId, EventDTO eventDTO,
			@Context ContainerRequestContext ctx);

	@DELETE
	@Path("/{clubId}/events/{eventId}")
	ActionResponseDTO deleteEvent(@PathParam("clubId") UUID clubId, @PathParam("eventId") UUID eventId,
			@Context ContainerRequestContext ctx);

	@POST
	@Path("/{clubId}/events/{eventId}/join")
	EventDTO joinEvent(@PathParam("clubId") UUID clubId, @PathParam("eventId") UUID eventId,
			@Context ContainerRequestContext ctx);

}

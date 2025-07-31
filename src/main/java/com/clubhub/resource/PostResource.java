package com.clubhub.resource;

import java.util.List;
import java.util.UUID;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.clubhub.entity.dto.PostDTO;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface PostResource {

	@GET
	@Path("/clubs/{clubId}/posts")
	List<PostDTO> getClubPosts(@PathParam("clubId") UUID clubId);

	@POST
	@Path("/clubs/{clubId}/posts")
	Response create(@PathParam("clubId") UUID clubId, PostDTO postDTO, @Context ContainerRequestContext ctx);

	@POST
	@Path("/posts/{postId}/like")
	Response like(@PathParam("postId") UUID postId);

	@POST
	@Path("/posts/{postId}/bookmark")
	Response bookmark(@PathParam("postId") UUID postId);

	@POST
	@Path("/posts/{postId}/share")
	Response share(@PathParam("postId") UUID postId);

	@GET
	@Path("/users/{userId}/feed")
	List<PostDTO> getFeed(@PathParam("userId") UUID userId);
}

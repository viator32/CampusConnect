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
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;

import com.clubhub.entity.dto.ActionResponseDTO;
import com.clubhub.entity.dto.CommentDTO;

import org.jboss.resteasy.reactive.ResponseStatus;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface CommentResource {

	@GET
	@Path("/posts/{postId}/comments")
	List<CommentDTO> getComments(@PathParam("postId") UUID postId,
			@QueryParam("offset") @DefaultValue("0") int offset,
			@QueryParam("limit") @DefaultValue("10") int limit,
			@Context ContainerRequestContext ctx);

	@POST
	@Path("/posts/{postId}/comments")
	@ResponseStatus(201)
	CommentDTO addComment(@PathParam("postId") UUID postId, CommentDTO commentDTO,
			@Context ContainerRequestContext ctx);

	@POST
	@Path("/comments/{commentId}/like")
	CommentDTO likeComment(@PathParam("commentId") UUID commentId, @Context ContainerRequestContext ctx);

	@DELETE
	@Path("/comments/{commentId}/like")
	CommentDTO unlikeComment(@PathParam("commentId") UUID commentId, @Context ContainerRequestContext ctx);

	@PUT
	@Path("/comments/{commentId}")
	CommentDTO updateComment(@PathParam("commentId") UUID commentId, CommentDTO commentDTO,
			@Context ContainerRequestContext ctx);

	@DELETE
	@Path("/comments/{commentId}")
	ActionResponseDTO deleteComment(@PathParam("commentId") UUID commentId, @Context ContainerRequestContext ctx);
}

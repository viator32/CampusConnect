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

import com.clubhub.entity.dto.CommentDTO;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface CommentResource {

    @GET
    @Path("/posts/{postId}/comments")
    List<CommentDTO> getComments(@PathParam("postId") UUID postId, @Context ContainerRequestContext ctx);

    @POST
    @Path("/posts/{postId}/comments")
    Response addComment(@PathParam("postId") UUID postId, CommentDTO commentDTO, @Context ContainerRequestContext ctx);

    @POST
    @Path("/comments/{commentId}/like")
    Response likeComment(@PathParam("commentId") UUID commentId);
}

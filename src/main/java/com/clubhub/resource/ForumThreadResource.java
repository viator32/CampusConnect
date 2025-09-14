package com.clubhub.resource;

import java.util.List;
import java.util.UUID;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;

import org.jboss.resteasy.reactive.ResponseStatus;

import com.clubhub.entity.dto.CommentDTO;
import com.clubhub.entity.dto.ForumThreadDTO;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface ForumThreadResource {

    @GET
    @Path("/threads/{threadId}")
    ForumThreadDTO getThread(@PathParam("threadId") UUID threadId, @Context ContainerRequestContext ctx);

    @GET
    @Path("/threads/{threadId}/comments")
    List<CommentDTO> getComments(@PathParam("threadId") UUID threadId, @Context ContainerRequestContext ctx);

    @POST
    @Path("/threads/{threadId}/comments")
    @ResponseStatus(201)
    CommentDTO addComment(@PathParam("threadId") UUID threadId, CommentDTO dto, @Context ContainerRequestContext ctx);

    @POST
    @Path("/threads/{threadId}/upvote")
    ForumThreadDTO upvoteThread(@PathParam("threadId") UUID threadId, @Context ContainerRequestContext ctx);

    @DELETE
    @Path("/threads/{threadId}/upvote")
    ForumThreadDTO removeUpvoteThread(@PathParam("threadId") UUID threadId, @Context ContainerRequestContext ctx);

    @POST
    @Path("/threads/{threadId}/downvote")
    ForumThreadDTO downvoteThread(@PathParam("threadId") UUID threadId, @Context ContainerRequestContext ctx);

    @DELETE
    @Path("/threads/{threadId}/downvote")
    ForumThreadDTO removeDownvoteThread(@PathParam("threadId") UUID threadId, @Context ContainerRequestContext ctx);
}

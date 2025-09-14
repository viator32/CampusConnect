package com.clubhub.resource;

import java.util.UUID;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;

import com.clubhub.entity.dto.ActionResponseDTO;
import com.clubhub.entity.dto.ReplyDTO;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface ReplyResource {

    @POST
    @Path("/replies/{replyId}/upvote")
    ReplyDTO upvoteReply(@PathParam("replyId") UUID replyId, @Context ContainerRequestContext ctx);

    @DELETE
    @Path("/replies/{replyId}/upvote")
    ReplyDTO removeUpvoteReply(@PathParam("replyId") UUID replyId, @Context ContainerRequestContext ctx);

    @POST
    @Path("/replies/{replyId}/downvote")
    ReplyDTO downvoteReply(@PathParam("replyId") UUID replyId, @Context ContainerRequestContext ctx);

    @DELETE
    @Path("/replies/{replyId}/downvote")
    ReplyDTO removeDownvoteReply(@PathParam("replyId") UUID replyId, @Context ContainerRequestContext ctx);

    @PUT
    @Path("/replies/{replyId}")
    ReplyDTO updateReply(@PathParam("replyId") UUID replyId, ReplyDTO dto, @Context ContainerRequestContext ctx);

    @DELETE
    @Path("/replies/{replyId}")
    ActionResponseDTO deleteReply(@PathParam("replyId") UUID replyId, @Context ContainerRequestContext ctx);
}

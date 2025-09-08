package com.clubhub.resource;

import java.util.List;
import java.util.UUID;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.DefaultValue;
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

    @POST
    @Path("/clubs/{clubId}/threads")
    @ResponseStatus(201)
    ForumThreadDTO addThread(@PathParam("clubId") UUID clubId, ForumThreadDTO dto, @Context ContainerRequestContext ctx);

    @GET
    @Path("/clubs/{clubId}/threads")
    List<ForumThreadDTO> getThreads(@PathParam("clubId") UUID clubId,
                    @QueryParam("offset") @DefaultValue("0") int offset,
                    @QueryParam("limit") @DefaultValue("10") int limit,
                    @Context ContainerRequestContext ctx);

    @GET
    @Path("/threads/{threadId}/comments")
    List<CommentDTO> getComments(@PathParam("threadId") UUID threadId, @Context ContainerRequestContext ctx);

    @POST
    @Path("/threads/{threadId}/comments")
    @ResponseStatus(201)
    CommentDTO addComment(@PathParam("threadId") UUID threadId, CommentDTO dto, @Context ContainerRequestContext ctx);
}

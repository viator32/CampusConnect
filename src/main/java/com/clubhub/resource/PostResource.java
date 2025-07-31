package com.clubhub.resource;

import java.util.UUID;

import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface PostResource {

    @POST
    @Path("/posts/{postId}/like")
    Response likePost(@PathParam("postId") UUID postId, @Context ContainerRequestContext ctx);

    @POST
    @Path("/posts/{postId}/bookmark")
    Response bookmarkPost(@PathParam("postId") UUID postId, @Context ContainerRequestContext ctx);

    @POST
    @Path("/posts/{postId}/share")
    Response sharePost(@PathParam("postId") UUID postId, @Context ContainerRequestContext ctx);
}

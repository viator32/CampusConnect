package com.clubhub.resource;

import java.util.UUID;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.clubhub.service.PostService;

@RequestScoped
@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PostResourceImpl implements PostResource {

    @Inject
    PostService postService;

    @Override
    public Response likePost(UUID postId, @Context ContainerRequestContext ctx) {
        UUID userId = (UUID) ctx.getProperty("userId");
        postService.like(postId, userId);
        return Response.ok().build();
    }

    @Override
    public Response bookmarkPost(UUID postId, @Context ContainerRequestContext ctx) {
        UUID userId = (UUID) ctx.getProperty("userId");
        postService.bookmark(postId, userId);
        return Response.ok().build();
    }

    @Override
    public Response sharePost(UUID postId, @Context ContainerRequestContext ctx) {
        UUID userId = (UUID) ctx.getProperty("userId");
        postService.share(postId, userId);
        return Response.ok().build();
    }
}

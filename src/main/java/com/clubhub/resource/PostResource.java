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
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.HeaderParam;

import com.clubhub.entity.dto.PostDTO;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface PostResource {

	@GET
	@Path("/posts/{postId}")
	PostDTO getPost(@PathParam("postId") UUID postId, @Context ContainerRequestContext ctx);

        @GET
        @Path("/posts/bookmarks")
        List<PostDTO> getBookmarkedPosts(@Context ContainerRequestContext ctx,
                        @QueryParam("offset") @DefaultValue("0") int offset,
                        @QueryParam("limit") @DefaultValue("10") int limit);

	@POST
	@Path("/posts/{postId}/like")
	PostDTO likePost(@PathParam("postId") UUID postId, @Context ContainerRequestContext ctx);

	@DELETE
	@Path("/posts/{postId}/like")
	PostDTO unlikePost(@PathParam("postId") UUID postId, @Context ContainerRequestContext ctx);

	@POST
	@Path("/posts/{postId}/bookmark")
	PostDTO bookmarkPost(@PathParam("postId") UUID postId, @Context ContainerRequestContext ctx);

        @POST
        @Path("/posts/{postId}/share")
        PostDTO sharePost(@PathParam("postId") UUID postId, @Context ContainerRequestContext ctx);

        @PUT
        @Path("/posts/{postId}/picture")
        @Consumes({ MediaType.APPLICATION_OCTET_STREAM, "image/png", "image/jpeg", "image/webp", "image/gif" })
        PostDTO updatePicture(@PathParam("postId") UUID postId, byte[] picture,
                        @HeaderParam("Content-Type") String contentType, @Context ContainerRequestContext ctx);
}

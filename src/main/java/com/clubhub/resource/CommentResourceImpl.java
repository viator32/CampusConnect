package com.clubhub.resource;

import java.net.URI;
import java.util.List;
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
import jakarta.ws.rs.WebApplicationException;

import com.clubhub.entity.dto.CommentDTO;
import com.clubhub.entity.mapper.ClubMapper;
import com.clubhub.service.CommentService;
import com.clubhub.service.PostService;

@RequestScoped
@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CommentResourceImpl implements CommentResource {

    @Inject
    CommentService commentService;

    @Inject
    PostService postService;

    @Override
    public List<CommentDTO> getComments(UUID postId, @Context ContainerRequestContext ctx) {
        UUID userId = (UUID) ctx.getProperty("userId");
        var post = postService.getPost(postId);
        boolean isMember = post.getClub().getMembersList().stream()
                .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
        if (!isMember) {
            throw new WebApplicationException(Response.Status.FORBIDDEN);
        }
        return post.getCommentsList().stream().map(ClubMapper::toDTO).toList();
    }

    @Override
    public Response addComment(UUID postId, CommentDTO dto, @Context ContainerRequestContext ctx) {
        UUID userId = (UUID) ctx.getProperty("userId");
        try {
            var comment = commentService.addComment(postId, userId, dto.content);
            return Response.created(URI.create("/api/posts/" + postId + "/comments/" + comment.getId())).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
    }

    @Override
    public Response likeComment(UUID commentId) {
        commentService.like(commentId);
        return Response.ok().build();
    }
}

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

import com.clubhub.entity.dto.CommentDTO;
import com.clubhub.entity.mapper.ClubMapper;
import com.clubhub.service.CommentService;
import com.clubhub.service.PostService;
import com.clubhub.service.UserService;

@RequestScoped
@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CommentResourceImpl implements CommentResource {

    @Inject
    CommentService commentService;

    @Inject
    PostService postService;

    @Inject
    UserService userService;

    @Override
    public List<CommentDTO> getComments(UUID postId) {
        var post = postService.getPost(postId);
        return post.getCommentsList().stream().map(ClubMapper::toDTO).toList();
    }

    @Override
    public Response addComment(UUID postId, CommentDTO dto, @Context ContainerRequestContext ctx) {
        UUID userId = (UUID) ctx.getProperty("userId");
        var user = userService.getUserById(userId);
        var comment = commentService.addComment(postId, user.getUsername(), dto.content);
        return Response.created(URI.create("/api/posts/" + postId + "/comments/" + comment.getId())).build();
    }

    @Override
    public Response likeComment(UUID commentId) {
        commentService.like(commentId);
        return Response.ok().build();
    }
}

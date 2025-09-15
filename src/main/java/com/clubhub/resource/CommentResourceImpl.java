package com.clubhub.resource;

import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;

import com.clubhub.entity.dto.ActionResponseDTO;
import com.clubhub.entity.dto.CommentDTO;
import com.clubhub.entity.mapper.CommentMapper;
import com.clubhub.service.CommentService;

@RequestScoped
@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CommentResourceImpl implements CommentResource {

	@Inject
	CommentService commentService;

	@Override
	public List<CommentDTO> getComments(UUID postId, int offset, int limit, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		var comments = commentService.getComments(postId, userId, offset, limit);
		return comments.stream().map(c -> CommentMapper.toDTO(c, userId)).toList();
	}

	@Override
	public CommentDTO addComment(UUID postId, CommentDTO dto, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		var comment = commentService.addComment(postId, userId, dto.getContent());
		return CommentMapper.toDTO(comment, userId);
	}

	@Override
	public CommentDTO likeComment(UUID commentId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		commentService.like(commentId, userId);
		var comment = commentService.getComment(commentId);
		return CommentMapper.toDTO(comment, userId);
	}

	@Override
	public CommentDTO unlikeComment(UUID commentId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		commentService.unlike(commentId, userId);
		var comment = commentService.getComment(commentId);
		return CommentMapper.toDTO(comment, userId);
	}

	@Override
	public CommentDTO updateComment(UUID commentId, CommentDTO dto, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		var updated = commentService.updateComment(commentId, userId, dto.getContent());
		return CommentMapper.toDTO(updated, userId);
	}

	@Override
	public ActionResponseDTO deleteComment(UUID commentId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		commentService.deleteComment(commentId, userId);
		return new ActionResponseDTO(true, "Comment deleted");
	}
}

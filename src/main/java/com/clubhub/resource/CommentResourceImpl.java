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
import com.clubhub.entity.mapper.ClubMapper;
import com.clubhub.exception.ClubHubErrorCode;
import com.clubhub.exception.ErrorPayload;
import com.clubhub.exception.ValidationException;
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
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
					.title("User not a member")
					.details("User must be a member of the club to view comments.")
					.messageParameter("postId", postId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		return post.getCommentsList().stream().map(ClubMapper::toDTO).toList();
	}

	@Override
	public CommentDTO addComment(UUID postId, CommentDTO dto, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		var comment = commentService.addComment(postId, userId, dto.content);
		return ClubMapper.toDTO(comment);
	}

	@Override
	public CommentDTO likeComment(UUID commentId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		commentService.like(commentId, userId);
		var comment = commentService.getComment(commentId);
		return ClubMapper.toDTO(comment);
	}

	@Override
	public CommentDTO unlikeComment(UUID commentId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		commentService.unlike(commentId, userId);
		var comment = commentService.getComment(commentId);
		return ClubMapper.toDTO(comment);
	}

	@Override
	public CommentDTO updateComment(UUID commentId, CommentDTO dto, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		var updated = commentService.updateComment(commentId, userId, dto.content);
		return ClubMapper.toDTO(updated);
	}

	@Override
	public ActionResponseDTO deleteComment(UUID commentId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		commentService.deleteComment(commentId, userId);
		return new ActionResponseDTO(true, "Comment deleted");
	}
}

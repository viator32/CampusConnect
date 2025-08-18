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
import jakarta.ws.rs.core.Response;

import com.clubhub.entity.dto.PostDTO;
import com.clubhub.entity.mapper.ClubMapper;
import com.clubhub.exception.ClubHubErrorCode;
import com.clubhub.exception.ErrorPayload;
import com.clubhub.exception.ValidationException;
import com.clubhub.service.PostService;

@RequestScoped
@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PostResourceImpl implements PostResource {

	@Inject
	PostService postService;

	@Override
	public PostDTO getPost(UUID postId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		var post = postService.getPost(postId);
		boolean isMember = post.getClub().getMembersList().stream()
				.anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
		if (!isMember) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
					.title("User not a member")
					.details("User must be a member of the club to view posts.")
					.messageParameter("postId", postId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		return ClubMapper.toDTO(post);
	}

	@Override
	public List<PostDTO> getBookmarkedPosts(@Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		return postService.getBookmarkedPosts(userId).stream().map(ClubMapper::toDTO).toList();
	}

        @Override
        public Response likePost(UUID postId, @Context ContainerRequestContext ctx) {
                UUID userId = (UUID) ctx.getProperty("userId");
                postService.like(postId, userId);
                return Response.ok().build();
        }

        @Override
        public Response unlikePost(UUID postId, @Context ContainerRequestContext ctx) {
                UUID userId = (UUID) ctx.getProperty("userId");
                postService.unlike(postId, userId);
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

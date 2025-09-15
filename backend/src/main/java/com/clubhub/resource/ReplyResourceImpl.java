package com.clubhub.resource;

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
import com.clubhub.entity.dto.ReplyDTO;
import com.clubhub.entity.mapper.ReplyMapper;
import com.clubhub.service.ReplyService;

@RequestScoped
@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ReplyResourceImpl implements ReplyResource {

	@Inject
	ReplyService replyService;

	@Override
	public ReplyDTO upvoteReply(UUID replyId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		replyService.upvote(replyId, userId);
		var reply = replyService.getReply(replyId);
		return ReplyMapper.toDTO(reply, userId);
	}

	@Override
	public ReplyDTO removeUpvoteReply(UUID replyId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		replyService.removeUpvote(replyId, userId);
		var reply = replyService.getReply(replyId);
		return ReplyMapper.toDTO(reply, userId);
	}

	@Override
	public ReplyDTO downvoteReply(UUID replyId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		replyService.downvote(replyId, userId);
		var reply = replyService.getReply(replyId);
		return ReplyMapper.toDTO(reply, userId);
	}

	@Override
	public ReplyDTO removeDownvoteReply(UUID replyId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		replyService.removeDownvote(replyId, userId);
		var reply = replyService.getReply(replyId);
		return ReplyMapper.toDTO(reply, userId);
	}

	@Override
	public ReplyDTO updateReply(UUID replyId, ReplyDTO dto, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		var updated = replyService.updateReply(replyId, userId, dto.getContent());
		return ReplyMapper.toDTO(updated, userId);
	}

	@Override
	public ActionResponseDTO deleteReply(UUID replyId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		replyService.deleteReply(replyId, userId);
		return new ActionResponseDTO(true, "Reply deleted");
	}
}

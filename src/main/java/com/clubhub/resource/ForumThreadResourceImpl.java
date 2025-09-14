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

import com.clubhub.entity.dto.ForumThreadDTO;
import com.clubhub.entity.dto.ReplyDTO;
import com.clubhub.entity.mapper.ClubMapper;
import com.clubhub.exception.ClubHubErrorCode;
import com.clubhub.exception.ErrorPayload;
import com.clubhub.exception.ValidationException;
import com.clubhub.service.ForumThreadService;
import com.clubhub.service.ReplyService;

@RequestScoped
@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ForumThreadResourceImpl implements ForumThreadResource {

        @Inject
        ForumThreadService threadService;

        @Inject
        ReplyService replyService;

        @Override
        public ForumThreadDTO getThread(UUID threadId, @Context ContainerRequestContext ctx) {
                UUID userId = (UUID) ctx.getProperty("userId");
                var thread = threadService.getThread(threadId);
                boolean isMember = thread.getClub().getMembersList().stream()
                                .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
                if (!isMember) {
                        throw new ValidationException(ErrorPayload.builder()
                                        .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                                        .title("User not a member")
                                        .details("User must be a member of the club to view threads.")
                                        .messageParameter("threadId", threadId.toString())
                                        .messageParameter("userId", userId.toString())
                                        .build());
                }
                return ClubMapper.toDTO(thread, userId);
        }

        @Override
    public List<ReplyDTO> getReplies(UUID threadId, @Context ContainerRequestContext ctx) {
                UUID userId = (UUID) ctx.getProperty("userId");
                var thread = threadService.getThread(threadId);
                boolean isMember = thread.getClub().getMembersList().stream()
                                .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
                if (!isMember) {
                        throw new ValidationException(ErrorPayload.builder()
                                        .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                                        .title("User not a member")
                                        .details("User must be a member of the club to view replies.")
                                        .messageParameter("threadId", threadId.toString())
                                        .messageParameter("userId", userId.toString())
                                        .build());
                }
                return thread.getReplies().stream().map(r -> ClubMapper.toDTO(r, userId)).toList();
        }

        @Override
    public ReplyDTO addReply(UUID threadId, ReplyDTO dto,
                    @Context ContainerRequestContext ctx) {
                UUID userId = (UUID) ctx.getProperty("userId");
                var reply = replyService.addReply(threadId, userId, dto.getContent());
                return ClubMapper.toDTO(reply, userId);
        }

        @Override
        public ForumThreadDTO upvoteThread(UUID threadId, @Context ContainerRequestContext ctx) {
                UUID userId = (UUID) ctx.getProperty("userId");
                threadService.upvote(threadId, userId);
                var thread = threadService.getThread(threadId);
                return ClubMapper.toDTO(thread, userId);
        }

        @Override
        public ForumThreadDTO removeUpvoteThread(UUID threadId, @Context ContainerRequestContext ctx) {
                UUID userId = (UUID) ctx.getProperty("userId");
                threadService.removeUpvote(threadId, userId);
                var thread = threadService.getThread(threadId);
                return ClubMapper.toDTO(thread, userId);
        }

        @Override
        public ForumThreadDTO downvoteThread(UUID threadId, @Context ContainerRequestContext ctx) {
                UUID userId = (UUID) ctx.getProperty("userId");
                threadService.downvote(threadId, userId);
                var thread = threadService.getThread(threadId);
                return ClubMapper.toDTO(thread, userId);
        }

        @Override
        public ForumThreadDTO removeDownvoteThread(UUID threadId, @Context ContainerRequestContext ctx) {
                UUID userId = (UUID) ctx.getProperty("userId");
                threadService.removeDownvote(threadId, userId);
                var thread = threadService.getThread(threadId);
                return ClubMapper.toDTO(thread, userId);
        }
}

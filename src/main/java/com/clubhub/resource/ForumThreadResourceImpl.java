package com.clubhub.resource;

import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;

import org.jboss.resteasy.reactive.ResponseStatus;

import com.clubhub.entity.dto.CommentDTO;
import com.clubhub.entity.dto.ForumThreadDTO;
import com.clubhub.entity.mapper.ClubMapper;
import com.clubhub.exception.ClubHubErrorCode;
import com.clubhub.exception.ErrorPayload;
import com.clubhub.exception.ValidationException;
import com.clubhub.service.ForumThreadService;

@RequestScoped
@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ForumThreadResourceImpl implements ForumThreadResource {

    @Inject
    ForumThreadService threadService;

    @Override
    @POST
    @Path("/clubs/{clubId}/threads")
    @ResponseStatus(201)
    public ForumThreadDTO addThread(@PathParam("clubId") UUID clubId, ForumThreadDTO dto,
            @Context ContainerRequestContext ctx) {

        UUID userId = (UUID) ctx.getProperty("userId");
        var thread = threadService.addThread(clubId, userId, dto.title, dto.content);
        return ClubMapper.toDTO(thread);
    }

    @Override
    @GET
    @Path("/threads/{threadId}/comments")
    public List<CommentDTO> getComments(@PathParam("threadId") UUID threadId,
            @Context ContainerRequestContext ctx) {
        UUID userId = (UUID) ctx.getProperty("userId");
        var thread = threadService.getThread(threadId);
        boolean isMember = thread.getClub().getMembersList().stream()
                .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
        if (!isMember) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                    .title("User not a member")
                    .details("User must be a member of the club to view comments.")
                    .messageParameter("threadId", threadId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        return thread.getPosts().stream().map(c -> ClubMapper.toDTO(c, userId)).toList();
    }

    @Override
    @POST
    @Path("/threads/{threadId}/comments")
    @ResponseStatus(201)
    public CommentDTO addComment(@PathParam("threadId") UUID threadId, CommentDTO dto,
            @Context ContainerRequestContext ctx) {
        UUID userId = (UUID) ctx.getProperty("userId");
        var comment = threadService.addReply(threadId, userId, dto.content);
        return ClubMapper.toDTO(comment, userId);
    }
}

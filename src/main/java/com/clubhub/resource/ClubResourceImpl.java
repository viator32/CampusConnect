package com.clubhub.resource;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;

import com.clubhub.entity.Club;
import com.clubhub.entity.dto.ClubDTO;
import com.clubhub.entity.dto.PostDTO;
import com.clubhub.entity.dto.EventDTO;
import com.clubhub.entity.mapper.ClubMapper;
import com.clubhub.entity.mapper.PostMapper;
import com.clubhub.entity.mapper.EventMapper;
import com.clubhub.entity.Event;
import com.clubhub.service.EventService;
import com.clubhub.service.ClubService;
import com.clubhub.service.PostService;
import com.clubhub.service.UserService;

@RequestScoped
public class ClubResourceImpl implements ClubResource {

	@Inject
	ClubService clubService;

    @Inject
    PostService postService;

    @Inject
    UserService userService;

    @Inject
    EventService eventService;

	@Override
	public List<ClubDTO> getAll() {
		return clubService.getAllClubs().stream()
				.map(ClubMapper::toSummaryDTO)
				.toList();
	}

	@Override
	public Response getById(UUID id, @Context ContainerRequestContext ctx) {
		Club club = clubService.getClubById(id);
		if (club == null) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}
		UUID userId = (UUID) ctx.getProperty("userId");
		boolean isMember = club.getMembersList().stream()
				.anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
		if (isMember) {
			return Response.ok(ClubMapper.toDTO(club)).build();
		}
		return Response.ok(ClubMapper.toSummaryDTO(club)).build();
	}

	@Override
	public Response create(ClubDTO clubDto) {
		Club created = clubService.createClub(ClubMapper.toEntity(clubDto));
		return Response.status(Response.Status.CREATED)
				.entity(ClubMapper.toDTO(created))
				.build();
	}

	@Override
	public Response update(UUID id, ClubDTO clubDto) {
		Club updated = clubService.updateClub(id, ClubMapper.toEntity(clubDto));
		if (updated == null) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}
		return Response.ok(ClubMapper.toDTO(updated)).build();
	}

	@Override
	public Response delete(UUID id) {
		boolean deleted = clubService.deleteClub(id);
		if (!deleted) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}
		return Response.noContent().build();
	}

	@Override
	public Response joinClub(UUID clubId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		clubService.joinClub(clubId, userId);
		return Response.ok().build();
	}

	@Override
	public List<PostDTO> getClubPosts(UUID clubId, @Context ContainerRequestContext ctx) {
		var club = clubService.getClubById(clubId);
		UUID userId = (UUID) ctx.getProperty("userId");
		boolean isMember = club.getMembersList().stream()
				.anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
		if (!isMember) {
			throw new jakarta.ws.rs.WebApplicationException(Response.Status.FORBIDDEN);
		}
		return club.getPosts().stream().map(ClubMapper::toDTO).toList();
	}

    @Override
    public Response createPost(UUID clubId, PostDTO dto, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		var user = userService.getUserById(userId);
		if (user == null) {
			return Response.status(Response.Status.UNAUTHORIZED).build();
		}
		var club = clubService.getClubById(clubId);
		if (club == null) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}
		boolean isMember = club.getMembersList().stream()
				.anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
		if (!isMember) {
			return Response.status(Response.Status.FORBIDDEN).build();
		}
		var post = PostMapper.toEntity(dto, club);
		post.setAuthor(user.getUsername());
		if (post.getTime() == null) {
			post.setTime(java.time.LocalDateTime.now());
		}
                postService.createPost(clubId, post);
                return Response.created(URI.create("/api/clubs/" + clubId + "/posts/" + post.getId())).build();
        }

    @Override
    public List<EventDTO> getClubEvents(UUID clubId, @Context ContainerRequestContext ctx) {
        var club = clubService.getClubById(clubId);
        UUID userId = (UUID) ctx.getProperty("userId");
        boolean isMember = club.getMembersList().stream()
                .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
        if (!isMember) {
            throw new jakarta.ws.rs.WebApplicationException(Response.Status.FORBIDDEN);
        }
        return club.getEvents().stream().map(EventMapper::toDTO).toList();
    }

    @Override
    public Response createEvent(UUID clubId, EventDTO eventDTO, @Context ContainerRequestContext ctx) {
        var club = clubService.getClubById(clubId);
        UUID userId = (UUID) ctx.getProperty("userId");
        boolean isMember = club.getMembersList().stream()
                .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
        if (!isMember) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        Event event = EventMapper.toEntity(eventDTO, club);
        eventService.save(event);
        return Response.created(URI.create("/api/clubs/" + clubId + "/events/" + event.getId())).build();
    }
}

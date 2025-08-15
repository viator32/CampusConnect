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
import com.clubhub.entity.Event;
import com.clubhub.entity.Member;
import com.clubhub.entity.MemberRole;
import com.clubhub.entity.dto.ClubDTO;
import com.clubhub.entity.dto.EventDTO;
import com.clubhub.entity.dto.MemberDTO;
import com.clubhub.entity.dto.PostDTO;
import com.clubhub.entity.mapper.ClubMapper;
import com.clubhub.entity.mapper.EventMapper;
import com.clubhub.entity.mapper.PostMapper;
import com.clubhub.exception.ClubHubErrorCode;
import com.clubhub.exception.ErrorPayload;
import com.clubhub.exception.NotFoundException;
import com.clubhub.exception.ValidationException;
import com.clubhub.service.ClubService;
import com.clubhub.service.EventService;
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
		UUID userId = (UUID) ctx.getProperty("userId");
		boolean isMember = club.getMembersList().stream()
				.anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
		if (isMember) {
			return Response.ok(ClubMapper.toDTO(club)).build();
		}
		return Response.ok(ClubMapper.toSummaryDTO(club)).build();
	}

	@Override
	public Response create(ClubDTO clubDto, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		Club created = clubService.createClub(ClubMapper.toEntity(clubDto), userId);
		return Response.status(Response.Status.CREATED)
				.entity(ClubMapper.toDTO(created))
				.build();
	}

	@Override
	public Response update(UUID id, ClubDTO clubDto) {
		Club updated = clubService.updateClub(id, ClubMapper.toEntity(clubDto));
		return Response.ok(ClubMapper.toDTO(updated)).build();
	}

	@Override
	public Response delete(UUID id) {
		clubService.deleteClub(id);
		return Response.noContent().build();
	}

	@Override
	public Response joinClub(UUID clubId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		clubService.joinClub(clubId, userId);
		return Response.ok().build();
	}

	@Override
	public Response leaveClub(UUID clubId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		clubService.leaveClub(clubId, userId);
		return Response.ok().build();
	}

	@Override
	public Response updateRole(UUID clubId, UUID memberId, MemberDTO dto, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		clubService.updateMemberRole(clubId, memberId, MemberRole.valueOf(dto.role.toUpperCase()), userId);
		return Response.ok().build();
	}

	@Override
	public List<PostDTO> getClubPosts(UUID clubId, @Context ContainerRequestContext ctx) {
		var club = clubService.getClubById(clubId);
		UUID userId = (UUID) ctx.getProperty("userId");
		boolean isMember = club.getMembersList().stream()
				.anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
		if (!isMember) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
					.title("User not a member")
					.details("User must be a member of the club to view posts.")
					.messageParameter("clubId", clubId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		return club.getPosts().stream().map(ClubMapper::toDTO).toList();
	}

	@Override
	public Response createPost(UUID clubId, PostDTO dto, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		var user = userService.getUserById(userId);
		var club = clubService.getClubById(clubId);
		Member membership = club.getMembersList().stream()
				.filter(m -> m.getUser() != null && m.getUser().getId().equals(userId))
				.findFirst().orElse(null);
		if (membership == null) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
					.title("User not a member")
					.details("User must be a member of the club to create posts.")
					.messageParameter("clubId", clubId.toString())
					.messageParameter("userId", userId.toString())
					.build());
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
	public Response updatePost(UUID clubId, UUID postId, PostDTO dto, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		postService.updatePost(clubId, postId, dto, userId);
		return Response.ok().build();
	}

	@Override
	public Response deletePost(UUID clubId, UUID postId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		postService.deletePost(clubId, postId, userId);
		return Response.noContent().build();
	}

	@Override
	public List<EventDTO> getClubEvents(UUID clubId, @Context ContainerRequestContext ctx) {
		var club = clubService.getClubById(clubId);
		UUID userId = (UUID) ctx.getProperty("userId");
		boolean isMember = club.getMembersList().stream()
				.anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
		if (!isMember) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
					.title("User not a member")
					.details("User must be a member of the club to view events.")
					.messageParameter("clubId", clubId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		return club.getEvents().stream().map(EventMapper::toDTO).toList();
	}

	@Override
	public Response createEvent(UUID clubId, EventDTO eventDTO, @Context ContainerRequestContext ctx) {
		var club = clubService.getClubById(clubId);
		UUID userId = (UUID) ctx.getProperty("userId");
		Member membership = club.getMembersList().stream()
				.filter(m -> m.getUser() != null && m.getUser().getId().equals(userId))
				.findFirst().orElse(null);
		if (membership == null) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
					.title("User not a member")
					.details("User must be a member of the club to create events.")
					.messageParameter("clubId", clubId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		if (membership.getRole() == MemberRole.MEMBER) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.INSUFFICIENT_PERMISSIONS)
					.title("Insufficient permissions")
					.details("User lacks permission to create events.")
					.messageParameter("clubId", clubId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		Event event = EventMapper.toEntity(eventDTO, club);
		eventService.save(event);
		return Response.created(URI.create("/api/clubs/" + clubId + "/events/" + event.getId())).build();
	}

	@Override
	public Response updateEvent(UUID clubId, UUID eventId, EventDTO eventDTO, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		eventService.updateEvent(clubId, eventId, eventDTO, userId);
		return Response.ok().build();
	}

	@Override
	public Response deleteEvent(UUID clubId, UUID eventId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		eventService.deleteEvent(clubId, eventId, userId);
		return Response.noContent().build();
	}

	@Override
	public Response joinEvent(UUID clubId, UUID eventId, @Context ContainerRequestContext ctx) {
		UUID userId = (UUID) ctx.getProperty("userId");
		Event event = eventService.getEventById(eventId);
		if (event.getClub() == null || !event.getClub().getId().equals(clubId)) {
			throw new NotFoundException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.EVENT_NOT_FOUND)
					.title("Event not found")
					.details("No event %s for club %s found.".formatted(eventId, clubId))
					.messageParameter("eventId", eventId.toString())
					.messageParameter("clubId", clubId.toString())
					.build());
		}
		eventService.joinEvent(eventId, userId);
		return Response.ok().build();
	}
}

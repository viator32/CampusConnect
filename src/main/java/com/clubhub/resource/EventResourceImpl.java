package com.clubhub.resource;

import java.util.UUID;
import java.util.stream.Collectors;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;

import com.clubhub.entity.Event;
import com.clubhub.entity.dto.CsvExportDTO;
import com.clubhub.entity.dto.EventDTO;
import com.clubhub.entity.mapper.EventMapper;
import com.clubhub.exception.ClubHubErrorCode;
import com.clubhub.exception.ErrorPayload;
import com.clubhub.exception.ValidationException;
import com.clubhub.service.EventService;

@RequestScoped
@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EventResourceImpl implements EventResource {

	@Inject
	EventService eventService;

	@Override
	public EventDTO getEvent(UUID eventId, @Context ContainerRequestContext ctx) {
		Event event = eventService.getEventById(eventId);
		UUID userId = (UUID) ctx.getProperty("userId");
		boolean isMember = event.getClub().getMembersList().stream()
				.anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
		if (!isMember) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
					.title("User not a member")
					.details("User must be a member of the club to view events.")
					.messageParameter("eventId", eventId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		return EventMapper.toDTO(event);
	}

	@Override
	public CsvExportDTO downloadAttendees(UUID eventId, @Context ContainerRequestContext ctx) {
		Event event = eventService.getEventById(eventId);
		UUID userId = (UUID) ctx.getProperty("userId");
		boolean isMember = event.getClub().getMembersList().stream()
				.anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
		if (!isMember) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
					.title("User not a member")
					.details("User must be a member of the club to download attendees.")
					.messageParameter("eventId", eventId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		String csv = "name,email\n" + event.getAttendees().stream()
				.map(u -> "%s,%s".formatted(u.getUsername(), u.getEmail()))
				.collect(Collectors.joining("\n"));
		return new CsvExportDTO("event-" + eventId + "-attendees.csv", csv);
	}
}

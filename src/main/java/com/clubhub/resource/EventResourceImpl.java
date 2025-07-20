package com.clubhub.resource;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import com.clubhub.entity.Club;
import com.clubhub.entity.Event;
import com.clubhub.entity.dto.EventDTO;
import com.clubhub.entity.mapper.EventMapper;
import com.clubhub.repository.EventService;
import com.clubhub.service.ClubService;

@RequestScoped
public class EventResourceImpl implements EventResource {

	@Inject
	EventService eventService;

	@Inject
	ClubService clubService;

	@Override
	public List<EventDTO> getAll(UUID clubId) {
		Club club = clubService.getClubById(clubId);
		return club.getEvents().stream()
				.map(EventMapper::toDTO)
				.toList();
	}

	@Override
	public Response create(UUID clubId, EventDTO eventDTO) {
		Club club = clubService.getClubById(clubId);
		Event event = EventMapper.toEntity(eventDTO, club);
		eventService.save(event);
		return Response.created(URI.create("/api/clubs/" + clubId + "/events/" + event.getId())).build();
	}
}
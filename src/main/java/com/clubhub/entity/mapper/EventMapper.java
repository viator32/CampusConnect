package com.clubhub.entity.mapper;

import com.clubhub.entity.Club;
import com.clubhub.entity.Event;
import com.clubhub.entity.EventStatus;
import com.clubhub.entity.dto.EventDTO;

public class EventMapper {

	public static EventDTO toDTO(Event event) {
		EventDTO dto = new EventDTO();
		dto.setId(event.getId());
		dto.setTitle(event.getTitle());
		dto.setDescription(event.getDescription());
		dto.setDate(event.getDate());
		dto.setTime(event.getTime());
		dto.setLocation(event.getLocation());
		dto.setCreatedAt(event.getCreatedAt());
		dto.setStatus(event.getStatus());
		dto.setClubId(event.getClub().getId());
		dto.setAttendeesCount(event.getAttendees().size());
		dto.setAttendees(event.getAttendees().stream().map(UserMapper::toSummaryDTO).toList());
		dto.setClub(ClubMapper.toSummaryDTO(event.getClub()));
		return dto;
	}

	public static Event toEntity(EventDTO dto, Club club) {
		Event event = new Event();
		event.setId(dto.getId());
		event.setTitle(dto.getTitle());
		event.setDescription(dto.getDescription());
		event.setDate(dto.getDate());
		event.setTime(dto.getTime());
		event.setLocation(dto.getLocation());
		event.setCreatedAt(dto.getCreatedAt());
		event.setStatus(dto.getStatus() != null ? dto.getStatus() : EventStatus.SCHEDULED);
		event.setClub(club);
		return event;
	}
}

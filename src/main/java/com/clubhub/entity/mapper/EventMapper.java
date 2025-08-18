package com.clubhub.entity.mapper;

import com.clubhub.entity.Club;
import com.clubhub.entity.Event;
import com.clubhub.entity.EventStatus;
import com.clubhub.entity.dto.EventDTO;

public class EventMapper {

        public static EventDTO toDTO(Event event) {
                EventDTO dto = new EventDTO();
                dto.id = event.getId();
                dto.title = event.getTitle();
                dto.description = event.getDescription();
                dto.date = event.getDate();
                dto.time = event.getTime();
                dto.createdAt = event.getCreatedAt();
                dto.status = event.getStatus();
                dto.clubId = event.getClub().getId();
                dto.attendeesCount = event.getAttendees().size();
                dto.attendees = event.getAttendees().stream().map(UserMapper::toSummaryDTO).toList();
                dto.club = ClubMapper.toSummaryDTO(event.getClub());
                return dto;
        }

        public static Event toEntity(EventDTO dto, Club club) {
                Event event = new Event();
                event.setId(dto.id);
                event.setTitle(dto.title);
                event.setDescription(dto.description);
                event.setDate(dto.date);
                event.setTime(dto.time);
                event.setCreatedAt(dto.createdAt);
                event.setStatus(dto.status != null ? dto.status : EventStatus.SCHEDULED);
                event.setClub(club);
                return event;
        }
}

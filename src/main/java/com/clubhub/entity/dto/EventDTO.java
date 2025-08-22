package com.clubhub.entity.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.clubhub.entity.EventStatus;

public class EventDTO {
        public UUID id;
        public String title;
        public String description;
        public LocalDate date;
        public String time;
        public String location;
        public LocalDateTime createdAt;
        public EventStatus status;
        public UUID clubId;
        public int attendeesCount;
        public List<UserDTO> attendees;
        public ClubDTO club;
}

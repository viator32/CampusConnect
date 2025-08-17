package com.clubhub.entity.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class EventDTO {
	public UUID id;
	public String title;
	public String description;
	public LocalDate date;
        public String time;
        public LocalDateTime createdAt;
        public UUID clubId;
        public int attendees;
        public ClubDTO club;
}

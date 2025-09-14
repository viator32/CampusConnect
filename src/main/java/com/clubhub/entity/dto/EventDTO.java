package com.clubhub.entity.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.clubhub.entity.EventStatus;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EventDTO {
        private UUID id;
        private String title;
        private String description;
        private LocalDate date;
        private String time;
        private String location;
        private LocalDateTime createdAt;
        private EventStatus status;
        private UUID clubId;
        private int attendeesCount;
        private List<UserDTO> attendees;
        private ClubDTO club;
}

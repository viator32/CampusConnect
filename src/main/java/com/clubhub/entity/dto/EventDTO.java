package com.clubhub.entity.dto;

import java.time.LocalDate;
import java.util.UUID;

public class EventDTO {
	public UUID id;
	public String title;
	public String description;
	public LocalDate date;
	public String time;
	public UUID clubId;
}

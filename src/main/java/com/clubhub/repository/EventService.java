package com.clubhub.repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import com.clubhub.entity.Event;

@ApplicationScoped
public class EventService {

	@Inject
	EventRepository eventRepository;

	public void save(Event event) {
		eventRepository.save(event);
	}
}
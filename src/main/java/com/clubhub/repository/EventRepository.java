package com.clubhub.repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import com.clubhub.entity.Event;

@ApplicationScoped
public class EventRepository {

	@Inject
	EntityManager em;

	public void save(Event event) {
		em.persist(event);
	}
}
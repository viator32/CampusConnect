package com.clubhub.repository;

import java.util.UUID;

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

        public Event findById(UUID id) {
                return em.find(Event.class, id);
        }

        public Event update(Event event) {
                return em.merge(event);
        }

        public void delete(UUID id) {
                Event e = em.find(Event.class, id);
                if (e != null) {
                        em.remove(e);
                }
        }
}


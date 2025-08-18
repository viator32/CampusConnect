package com.clubhub.repository;

import java.util.List;
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

    public List<Event> findFeedForUser(UUID userId, int page, int size) {
        String jpql = "SELECT e FROM Event e JOIN e.club c JOIN c.membersList m "
                + "WHERE m.user.id = :userId AND e.createdAt >= m.joinedAt ORDER BY e.createdAt DESC";
        return em.createQuery(jpql, Event.class)
                .setParameter("userId", userId)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();
    }

    public long countEventsAttendedByUser(UUID userId) {
        return em.createQuery(
                "SELECT COUNT(e) FROM Event e JOIN e.attendees u WHERE u.id = :userId",
                Long.class)
                .setParameter("userId", userId)
                .getSingleResult();
    }
}

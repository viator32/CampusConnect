package com.clubhub.repository;

import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;

import com.clubhub.entity.Club;

@ApplicationScoped
public class ClubRepository {

	@Inject
	EntityManager em;

	public List<Club> findAll() {
		return em.createQuery("""
				SELECT DISTINCT c FROM Club c
				LEFT JOIN FETCH c.events
				LEFT JOIN FETCH c.posts
				LEFT JOIN FETCH c.membersList
				LEFT JOIN FETCH c.forumThreads
				""", Club.class)
				.getResultList();
	}

	public Club findById(UUID id) {
		try {
			return em.createQuery("""
					SELECT c FROM Club c
					LEFT JOIN FETCH c.events
					LEFT JOIN FETCH c.posts
					LEFT JOIN FETCH c.membersList
					LEFT JOIN FETCH c.forumThreads
					WHERE c.id = :id
					""", Club.class)
					.setParameter("id", id)
					.getSingleResult();
		} catch (NoResultException e) {
			return null;
		}
	}

	public void save(Club club) {
		em.persist(club);
	}

	public Club update(Club club) {
		return em.merge(club);
	}

	public void delete(UUID id) {
		Club club = findById(id);
		if (club != null) {
			em.remove(club);
		}
	}

}

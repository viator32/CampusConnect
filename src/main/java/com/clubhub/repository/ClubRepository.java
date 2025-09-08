package com.clubhub.repository;

import java.util.List;
import java.util.UUID;

import com.clubhub.entity.Preference;

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

        public List<Club> search(String name, String category, Preference interest,
                        Integer minMembers, Integer maxMembers, int page, int size) {
                StringBuilder sb = new StringBuilder("""
                                SELECT DISTINCT c FROM Club c
                                LEFT JOIN FETCH c.events
                                LEFT JOIN FETCH c.posts
                                LEFT JOIN FETCH c.membersList
                                LEFT JOIN FETCH c.forumThreads
                                WHERE 1=1
                                """);

                if (name != null) {
                        sb.append(" AND LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))");
                }
                if (category != null) {
                        sb.append(" AND c.category = :category");
                }
                if (interest != null) {
                        sb.append(" AND c.interest = :interest");
                }
                if (minMembers != null) {
                        sb.append(" AND c.members >= :minMembers");
                }
                if (maxMembers != null) {
                        sb.append(" AND c.members <= :maxMembers");
                }

                var query = em.createQuery(sb.toString(), Club.class);

                if (name != null) {
                        query.setParameter("name", name);
                }
                if (category != null) {
                        query.setParameter("category", category);
                }
                if (interest != null) {
                        query.setParameter("interest", interest);
                }
                if (minMembers != null) {
                        query.setParameter("minMembers", minMembers);
                }
                if (maxMembers != null) {
                        query.setParameter("maxMembers", maxMembers);
                }

                query.setFirstResult(page * size);
                query.setMaxResults(size);

                return query.getResultList();
        }

        public long countSearch(String name, String category, Preference interest,
                        Integer minMembers, Integer maxMembers) {
                StringBuilder sb = new StringBuilder("SELECT COUNT(c) FROM Club c WHERE 1=1");

                if (name != null) {
                        sb.append(" AND LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))");
                }
                if (category != null) {
                        sb.append(" AND c.category = :category");
                }
                if (interest != null) {
                        sb.append(" AND c.interest = :interest");
                }
                if (minMembers != null) {
                        sb.append(" AND c.members >= :minMembers");
                }
                if (maxMembers != null) {
                        sb.append(" AND c.members <= :maxMembers");
                }

                var query = em.createQuery(sb.toString(), Long.class);

                if (name != null) {
                        query.setParameter("name", name);
                }
                if (category != null) {
                        query.setParameter("category", category);
                }
                if (interest != null) {
                        query.setParameter("interest", interest);
                }
                if (minMembers != null) {
                        query.setParameter("minMembers", minMembers);
                }
                if (maxMembers != null) {
                        query.setParameter("maxMembers", maxMembers);
                }

                return query.getSingleResult();
        }

        public Club findById(UUID id) {
                try {
                        return em.createQuery("""
                                        SELECT DISTINCT c FROM Club c
                                        LEFT JOIN FETCH c.events e
                                        LEFT JOIN FETCH e.attendees
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

        public long countAll() {
                return em.createQuery("SELECT COUNT(c) FROM Club c", Long.class)
                                .getSingleResult();
        }

}

package com.clubhub.repository;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import com.clubhub.entity.Comment;

@ApplicationScoped
public class CommentRepository {

	@Inject
	EntityManager em;

	public void save(Comment comment) {
		em.persist(comment);
	}

	public Comment findById(UUID id) {
		return em.find(Comment.class, id);
	}

        public Comment update(Comment comment) {
                return em.merge(comment);
        }

        public boolean hasUserLikedComment(UUID commentId, UUID userId) {
                Long count = em.createQuery("""
                                SELECT COUNT(c)
                                FROM Comment c
                                JOIN c.likedBy u
                                WHERE c.id = :commentId AND u.id = :userId
                                """, Long.class)
                                .setParameter("commentId", commentId)
                                .setParameter("userId", userId)
                                .getSingleResult();
                return count > 0;
        }

	public void delete(UUID id) {
		Comment c = em.find(Comment.class, id);
		if (c != null) {
			em.remove(c);
		}
	}
}

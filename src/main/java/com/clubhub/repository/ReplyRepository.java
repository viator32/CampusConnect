package com.clubhub.repository;

import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import com.clubhub.entity.Reply;

@ApplicationScoped
public class ReplyRepository {

	@Inject
        EntityManager em;

	public void save(Reply reply) {
		em.persist(reply);
	}

	public Reply findById(UUID id) {
		return em.find(Reply.class, id);
	}

        public Reply update(Reply reply) {
                return em.merge(reply);
        }

        public List<Reply> findByThread(UUID threadId, int offset, int limit) {
                return em.createQuery("""
                                SELECT r
                                FROM Reply r
                                WHERE r.thread.id = :threadId
                                ORDER BY r.time ASC
                                """, Reply.class)
                                .setParameter("threadId", threadId)
                                .setFirstResult(offset)
                                .setMaxResults(limit)
                                .getResultList();
        }

	public boolean hasUserUpvotedReply(UUID replyId, UUID userId) {
		Long count = em.createQuery("""
				SELECT COUNT(r)
				FROM Reply r
				JOIN r.upvotedBy u
				WHERE r.id = :replyId AND u.id = :userId
				""", Long.class)
				.setParameter("replyId", replyId)
				.setParameter("userId", userId)
				.getSingleResult();
		return count > 0;
	}

	public boolean hasUserDownvotedReply(UUID replyId, UUID userId) {
		Long count = em.createQuery("""
				SELECT COUNT(r)
				FROM Reply r
				JOIN r.downvotedBy u
				WHERE r.id = :replyId AND u.id = :userId
				""", Long.class)
				.setParameter("replyId", replyId)
				.setParameter("userId", userId)
				.getSingleResult();
		return count > 0;
	}

	public void delete(UUID id) {
		Reply r = em.find(Reply.class, id);
		if (r != null) {
			em.remove(r);
		}
	}
}

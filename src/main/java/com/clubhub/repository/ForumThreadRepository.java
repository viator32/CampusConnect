package com.clubhub.repository;

import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import com.clubhub.entity.ForumThread;

@ApplicationScoped
public class ForumThreadRepository {

    @Inject
    EntityManager em;

    public void save(ForumThread thread) {
        em.persist(thread);
    }

    public ForumThread findById(UUID id) {
        return em.find(ForumThread.class, id);
    }

    public ForumThread update(ForumThread thread) {
        return em.merge(thread);
    }

    public boolean hasUserUpvotedThread(UUID threadId, UUID userId) {
        Long count = em.createQuery("""
                        SELECT COUNT(t)
                        FROM ForumThread t
                        JOIN t.upvotedBy u
                        WHERE t.id = :threadId AND u.id = :userId
                        """, Long.class)
                .setParameter("threadId", threadId)
                .setParameter("userId", userId)
                .getSingleResult();
        return count > 0;
    }

    public boolean hasUserDownvotedThread(UUID threadId, UUID userId) {
        Long count = em.createQuery("""
                        SELECT COUNT(t)
                        FROM ForumThread t
                        JOIN t.downvotedBy u
                        WHERE t.id = :threadId AND u.id = :userId
                        """, Long.class)
                .setParameter("threadId", threadId)
                .setParameter("userId", userId)
                .getSingleResult();
        return count > 0;
    }

    public List<ForumThread> findByClub(UUID clubId, int offset, int limit) {
        String jpql = "SELECT t FROM ForumThread t WHERE t.club.id = :clubId ORDER BY t.lastActivity DESC";
        return em.createQuery(jpql, ForumThread.class)
                .setParameter("clubId", clubId)
                .setFirstResult(offset)
                .setMaxResults(limit)
                .getResultList();
    }
}

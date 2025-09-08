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

    public List<ForumThread> findByClub(UUID clubId, int offset, int limit) {
        String jpql = "SELECT t FROM ForumThread t WHERE t.club.id = :clubId ORDER BY t.lastActivity DESC";
        return em.createQuery(jpql, ForumThread.class)
                .setParameter("clubId", clubId)
                .setFirstResult(offset)
                .setMaxResults(limit)
                .getResultList();
    }
}

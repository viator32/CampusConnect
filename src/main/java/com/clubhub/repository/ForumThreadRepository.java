package com.clubhub.repository;

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
}

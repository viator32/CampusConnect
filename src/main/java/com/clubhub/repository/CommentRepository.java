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

    public void delete(UUID id) {
        Comment c = em.find(Comment.class, id);
        if (c != null) {
            em.remove(c);
        }
    }
}

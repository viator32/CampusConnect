package com.clubhub.repository;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import com.clubhub.entity.Post;

@ApplicationScoped
public class PostRepository {

    @Inject
    EntityManager em;

    public void save(Post post) {
        em.persist(post);
    }

    public Post findById(UUID id) {
        return em.find(Post.class, id);
    }

    public Post update(Post post) {
        return em.merge(post);
    }
}

package com.clubhub.repository;

import java.util.List;
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

	public void delete(UUID id) {
		Post p = em.find(Post.class, id);
		if (p != null) {
			em.remove(p);
		}
	}

	public List<Post> findFeedForUser(UUID userId, int offset, int limit) {
		String jpql = "SELECT p FROM Post p JOIN p.club c JOIN c.membersList m WHERE m.user.id = :userId "
				+ "AND p.time >= m.joinedAt ORDER BY p.time DESC";
		return em.createQuery(jpql, Post.class)
				.setParameter("userId", userId)
				.setFirstResult(offset)
				.setMaxResults(limit)
				.getResultList();
	}

	public boolean hasUserLikedPost(UUID postId, UUID userId) {
		Long count = em.createQuery("""
				SELECT COUNT(p)
				FROM Post p
				JOIN p.likedBy u
				WHERE p.id = :postId AND u.id = :userId
				""", Long.class)
				.setParameter("postId", postId)
				.setParameter("userId", userId)
				.getSingleResult();
		return count > 0;
	}

	public boolean hasUserBookmarkedPost(UUID postId, UUID userId) {
		Long count = em.createQuery("""
				SELECT COUNT(p)
				FROM Post p
				JOIN p.bookmarkedBy u
				WHERE p.id = :postId AND u.id = :userId
				""", Long.class)
				.setParameter("postId", postId)
				.setParameter("userId", userId)
				.getSingleResult();
		return count > 0;
	}

	public List<Post> findBookmarkedPostsByUser(UUID userId, int offset, int limit) {
		String jpql = "SELECT p FROM Post p JOIN p.bookmarkedBy u WHERE u.id = :userId ORDER BY p.time DESC";
		return em.createQuery(jpql, Post.class)
				.setParameter("userId", userId)
				.setFirstResult(offset)
				.setMaxResults(limit)
				.getResultList();
	}

	public List<Post> findByClub(UUID clubId, int offset, int limit) {
		String jpql = "SELECT p FROM Post p WHERE p.club.id = :clubId ORDER BY p.time DESC";
		return em.createQuery(jpql, Post.class)
				.setParameter("clubId", clubId)
				.setFirstResult(offset)
				.setMaxResults(limit)
				.getResultList();
	}

	public long countPostsByAuthor(UUID authorId) {
		return em.createQuery("SELECT COUNT(p) FROM Post p WHERE p.author.id = :authorId", Long.class)
				.setParameter("authorId", authorId)
				.getSingleResult();
	}
}

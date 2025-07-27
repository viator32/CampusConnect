package com.clubhub.repository;

import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import com.clubhub.entity.User;

@ApplicationScoped
public class UserRepository {

	@Inject
	EntityManager em;

	public User findById(UUID id) {
		try {
			return em.createQuery("""
					SELECT u FROM User u
					LEFT JOIN FETCH u.joinedClubs
					WHERE u.id = :id
					""", User.class).setParameter("id", id).getSingleResult();
		} catch (NullPointerException e) {
			return null;
		}
	}

	public List<User> findAll() {
		return em.createQuery("SELECT u FROM User u", User.class).getResultList();
	}

	public User findByEmail(String email) {
		try {
			return em.createQuery("SELECT u FROM User u WHERE  u.email = :email", User.class)
					.setParameter("email", email).getSingleResult();

		} catch (NullPointerException e) {
			return null;
		}
	}

	public void save(User user) {
		em.persist(user);
	}

	public User update(User user) {
		return em.merge(user);
	}

	public void delete(UUID id) {
		User user = findById(id);
		if (user != null) {
			em.remove(user);
		}
	}

}

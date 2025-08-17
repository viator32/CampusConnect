package com.clubhub.repository;

import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import com.clubhub.entity.Member;

@ApplicationScoped
public class MemberRepository {

    @Inject
    EntityManager em;

    public boolean existsByClubAndUser(UUID clubId, UUID userId) {
        Long count = em.createQuery("""
                SELECT COUNT(m)
                FROM Member m
                WHERE m.club.id = :clubId AND m.user.id = :userId
                """, Long.class)
                .setParameter("clubId", clubId)
                .setParameter("userId", userId)
                .getSingleResult();
        return count > 0;
    }

    public Member findByClubAndUser(UUID clubId, UUID userId) {
        List<Member> result = em.createQuery("""
                SELECT m
                FROM Member m
                WHERE m.club.id = :clubId AND m.user.id = :userId
                """, Member.class)
                .setParameter("clubId", clubId)
                .setParameter("userId", userId)
                .getResultList();
        return result.isEmpty() ? null : result.get(0);
    }
}

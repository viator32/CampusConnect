package com.clubhub.service;

import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import com.clubhub.entity.Club;
import com.clubhub.entity.Member;
import com.clubhub.entity.User;
import com.clubhub.repository.ClubRepository;

@ApplicationScoped
public class ClubService {

	@Inject
	ClubRepository clubRepository;

	@Inject
	ClubService clubService;

	@Inject
	EntityManager em;
	@Inject
	UserService userService;

	public List<Club> getAllClubs() {
		return clubRepository.findAll();
	}

	public Club getClubById(UUID id) {
		return clubRepository.findById(id);
	}

	@Transactional
	public Club createClub(Club club) {
		clubRepository.save(club);
		return club;
	}

	@Transactional
	public Club updateClub(UUID id, Club updated) {
		Club existing = clubRepository.findById(id);
		if (existing == null) {
			return null;
		}
		existing.setName(updated.getName());
		existing.setDescription(updated.getDescription());
		existing.setLocation(updated.getLocation());

		return clubRepository.update(existing);
	}

	@Transactional
	public boolean deleteClub(UUID id) {
		Club existing = clubRepository.findById(id);
		if (existing == null) {
			return false;
		}
		clubRepository.delete(id);
		return true;
	}

    @Transactional
    public void joinClub(UUID clubId, UUID userId) {
        Club club = em.find(Club.class, clubId);
        if (club == null) {
                throw new IllegalArgumentException("Club not found");
        }

        User user = userService.getUserById(userId);
        if (user == null) {
                throw new IllegalArgumentException("User not found");
        }

        boolean alreadyMember = club.getMembersList().stream()
                        .anyMatch(member -> member.getUser() != null && member.getUser().getId().equals(user.getId()));
        if (alreadyMember) {
                return;
        }

        Member member = new Member();
        member.setClub(club);
        member.setUser(user);
        member.setRole("member");
        member.setAvatar("👤");

        em.persist(member);

        club.getMembersList().add(member);
        club.setMembers(club.getMembersList().size());

        user.getJoinedClubs().add(club);
        user.getMemberships().add(member);

        em.merge(club);
        em.merge(user);
    }

}

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
import com.clubhub.exception.ClubHubErrorCode;
import com.clubhub.exception.ErrorPayload;
import com.clubhub.exception.NotFoundException;
import com.clubhub.exception.ValidationException;
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
                Club club = clubRepository.findById(id);
                if (club == null) {
                        throw new NotFoundException(ErrorPayload.builder()
                                        .errorCode(ClubHubErrorCode.CLUB_NOT_FOUND)
                                        .title("Club not found")
                                        .details("No club with id %s exists.".formatted(id))
                                        .messageParameter("clubId", id.toString())
                                        .sourcePointer("clubId")
                                        .build());
                }
                return club;
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
                        throw new NotFoundException(ErrorPayload.builder()
                                        .errorCode(ClubHubErrorCode.CLUB_NOT_FOUND)
                                        .title("Club not found")
                                        .details("No club with id %s exists.".formatted(id))
                                        .messageParameter("clubId", id.toString())
                                        .sourcePointer("clubId")
                                        .build());
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
                        throw new NotFoundException(ErrorPayload.builder()
                                        .errorCode(ClubHubErrorCode.CLUB_NOT_FOUND)
                                        .title("Club not found")
                                        .details("No club with id %s exists.".formatted(id))
                                        .messageParameter("clubId", id.toString())
                                        .sourcePointer("clubId")
                                        .build());
                }
                clubRepository.delete(id);
                return true;
        }

    @Transactional
    public void joinClub(UUID clubId, UUID userId) {
        Club club = em.find(Club.class, clubId);
        if (club == null) {
                throw new NotFoundException(ErrorPayload.builder()
                                .errorCode(ClubHubErrorCode.CLUB_NOT_FOUND)
                                .title("Club not found")
                                .details("No club with id %s exists.".formatted(clubId))
                                .messageParameter("clubId", clubId.toString())
                                .sourcePointer("clubId")
                                .build());
        }

        User user = userService.getUserById(userId);

        boolean alreadyMember = club.getMembersList().stream()
                        .anyMatch(member -> member.getUser() != null && member.getUser().getId().equals(user.getId()));
        if (alreadyMember) {
                throw new ValidationException(ErrorPayload.builder()
                                .errorCode(ClubHubErrorCode.ALREADY_MEMBER)
                                .title("Already a member")
                                .details("User is already a member of this club.")
                                .messageParameter("clubId", clubId.toString())
                                .messageParameter("userId", userId.toString())
                                .build());
        }

        Member member = new Member();
        member.setClub(club);
        member.setUser(user);
        member.setRole("member");
        member.setAvatar("👤");
        member.setJoinedAt(java.time.LocalDateTime.now());

        em.persist(member);

        club.getMembersList().add(member);
        club.setMembers(club.getMembersList().size());

        user.getJoinedClubs().add(club);
        user.getMemberships().add(member);

        em.merge(club);
        em.merge(user);
    }

}

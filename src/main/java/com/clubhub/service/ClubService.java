package com.clubhub.service;

import java.util.List;
import java.util.UUID;

import com.clubhub.entity.Preference;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import com.clubhub.entity.Club;
import com.clubhub.entity.Member;
import com.clubhub.entity.MemberRole;
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

    @Inject
    ObjectStorageService objectStorageService;

        public List<Club> getAllClubs() {
                return clubRepository.findAll();
        }

        public List<Club> searchClubs(String name, String category, Preference interest,
                        Integer minMembers, Integer maxMembers, int page, int size) {
                return clubRepository.search(name, category, interest, minMembers, maxMembers, page, size);
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
	public Club createClub(Club club, UUID creatorId) {
		clubRepository.save(club);

		User user = userService.getUserById(creatorId);

		Member member = new Member();
		member.setClub(club);
		member.setUser(user);
                member.setRole(MemberRole.ADMIN);
                member.setJoinedAt(java.time.LocalDateTime.now());

		em.persist(member);

		club.getMembersList().add(member);
		club.setMembers(club.getMembersList().size());

		user.getMemberships().add(member);

		em.merge(club);
		em.merge(user);

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
                existing.setCategory(updated.getCategory());
               existing.setSubject(updated.getSubject());
               existing.setInterest(updated.getInterest());

               Club merged = clubRepository.update(existing);
               // Initialize collections to avoid LazyInitializationException
               merged.getEvents().forEach(e -> e.getAttendees().size());
               merged.getPosts().forEach(p -> {
                       p.getCommentsList().size();
                       p.getLikedBy().size();
                       p.getBookmarkedBy().size();
                       if (p.getPoll() != null) {
                               p.getPoll().getOptions().size();
                       }
               });
               return merged;
       }

       @Transactional
       public void updateAvatar(UUID id, byte[] avatar, String contentType) {
        Club existing = getClubById(id);
        var stored = objectStorageService.upload("clubs/" + id, avatar, contentType);
        existing.setAvatarBucket(stored.bucket());
        existing.setAvatarObject(stored.objectKey());
        existing.setAvatarEtag(stored.etag());
        clubRepository.update(existing);
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
                member.setRole(MemberRole.MEMBER);
                member.setJoinedAt(java.time.LocalDateTime.now());

		em.persist(member);

		club.getMembersList().add(member);
		club.setMembers(club.getMembersList().size());

		user.getMemberships().add(member);

		em.merge(club);
		em.merge(user);
	}

	@Transactional
	public void leaveClub(UUID clubId, UUID userId) {
		Club club = getClubById(clubId);
		Member membership = club.getMembersList().stream()
				.filter(m -> m.getUser() != null && m.getUser().getId().equals(userId))
				.findFirst()
				.orElse(null);
		if (membership == null) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
					.title("User not a member")
					.details("User is not a member of this club.")
					.messageParameter("clubId", clubId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		if (membership.getRole() == MemberRole.ADMIN) {
			long adminCount = club.getMembersList().stream()
					.filter(m -> m.getRole() == MemberRole.ADMIN)
					.count();
			if (adminCount <= 1) {
				throw new ValidationException(ErrorPayload.builder()
						.errorCode(ClubHubErrorCode.LAST_ADMIN_LEAVE)
						.title("Cannot leave club")
						.details("At least one admin must remain in the club.")
						.messageParameter("clubId", clubId.toString())
						.messageParameter("userId", userId.toString())
						.build());
			}
		}

		User user = membership.getUser();

		club.getMembersList().remove(membership);
		club.setMembers(club.getMembersList().size());

		user.getMemberships().remove(membership);

		em.remove(em.contains(membership) ? membership : em.merge(membership));
		em.merge(club);
		em.merge(user);
	}

	@Transactional
	public void updateMemberRole(UUID clubId, UUID memberId, MemberRole newRole, UUID actingUserId) {
		Club club = getClubById(clubId);
		Member actingMember = club.getMembersList().stream()
				.filter(m -> m.getUser() != null && m.getUser().getId().equals(actingUserId))
				.findFirst()
				.orElse(null);
		if (actingMember == null || actingMember.getRole() != MemberRole.ADMIN) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.INSUFFICIENT_PERMISSIONS)
					.title("Insufficient permissions")
					.details("Only admins can change member roles.")
					.messageParameter("clubId", clubId.toString())
					.messageParameter("userId", actingUserId.toString())
					.build());
		}

		Member member = club.getMembersList().stream()
				.filter(m -> m.getId().equals(memberId))
				.findFirst()
				.orElse(null);
		if (member == null) {
			throw new NotFoundException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.MEMBER_NOT_FOUND)
					.title("Member not found")
					.details("No member with id %s exists.".formatted(memberId))
					.messageParameter("memberId", memberId.toString())
					.build());
		}

		if (actingMember.getId().equals(member.getId())) {
			long adminCount = club.getMembersList().stream()
					.filter(m -> m.getRole() == MemberRole.ADMIN)
					.count();
			if (adminCount <= 1 && newRole != MemberRole.ADMIN) {
				throw new ValidationException(ErrorPayload.builder()
						.errorCode(ClubHubErrorCode.LAST_ADMIN_ROLE_CHANGE)
						.title("Cannot change role")
						.details("At least one admin must remain in the club.")
						.messageParameter("clubId", clubId.toString())
						.messageParameter("memberId", memberId.toString())
						.build());
			}
		}

		member.setRole(newRole);
		em.merge(member);
	}

}

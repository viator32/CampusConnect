package com.clubhub.service;

import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import com.clubhub.entity.Club;
import com.clubhub.entity.Member;
import com.clubhub.entity.MemberRole;
import com.clubhub.entity.Preference;
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

	/**
	 * Retrieves all clubs from the repository.
	 *
	 * @return list of all clubs
	 */
	public List<Club> getAllClubs() {
		return clubRepository.findAll();
	}

	/**
	 * Searches for clubs matching the provided filters.
	 *
	 * @param name
	 *     optional name fragment to match
	 * @param category
	 *     optional category to filter by
	 * @param interest
	 *     optional interest to filter by
	 * @param minMembers
	 *     minimum number of members
	 * @param maxMembers
	 *     maximum number of members
	 * @param page
	 *     page index for pagination
	 * @param size
	 *     number of results per page
	 * @return filtered list of clubs
	 */
	public List<Club> searchClubs(String name, String category, Preference interest,
			Integer minMembers, Integer maxMembers, int page, int size) {
		return clubRepository.search(name, category, interest, minMembers, maxMembers, page, size);
	}

	/**
	 * Counts all clubs in the repository.
	 *
	 * @return total number of clubs
	 */
	public long getClubCount() {
		return clubRepository.countAll();
	}

	/**
	 * Counts clubs that match the given filters.
	 *
	 * @param name
	 *     optional name fragment to match
	 * @param category
	 *     optional category to filter by
	 * @param interest
	 *     optional interest to filter by
	 * @param minMembers
	 *     minimum number of members
	 * @param maxMembers
	 *     maximum number of members
	 * @return number of clubs matching the criteria
	 */
	public long getClubCount(String name, String category, Preference interest,
			Integer minMembers, Integer maxMembers) {
		return clubRepository.countSearch(name, category, interest, minMembers, maxMembers);
	}

	/**
	 * Retrieves a club by its identifier.
	 *
	 * @param id
	 *     the club identifier
	 * @return the requested club
	 * @throws NotFoundException
	 *     if no club with the ID exists
	 */
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

	/**
	 * Creates a new club and assigns the creator as an admin.
	 *
	 * @param club
	 *     the club entity to persist
	 * @param creatorId
	 *     ID of the user creating the club
	 * @return the created club
	 */
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

	/**
	 * Updates an existing club with the provided values.
	 *
	 * @param id
	 *     identifier of the club to update
	 * @param updated
	 *     club containing new values
	 * @param actingUserId
	 *     user performing the update
	 * @return the updated club
	 */
	@Transactional
	public Club updateClub(UUID id, Club updated, UUID actingUserId) {
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
		Member actingMember = existing.getMembersList().stream()
				.filter(m -> m.getUser() != null && m.getUser().getId().equals(actingUserId))
				.findFirst()
				.orElse(null);
		if (actingMember == null || actingMember.getRole() != MemberRole.ADMIN) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.INSUFFICIENT_PERMISSIONS)
					.title("Insufficient permissions")
					.details("Only admins can update club details.")
					.messageParameter("clubId", id.toString())
					.messageParameter("userId", actingUserId.toString())
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

	/**
	 * Updates the avatar image for the specified club.
	 *
	 * @param id
	 *     the club identifier
	 * @param avatar
	 *     avatar image data
	 * @param contentType
	 *     MIME type of the image
	 * @param actingUserId
	 *     user performing the update
	 */
	@Transactional
	public void updateAvatar(UUID id, byte[] avatar, String contentType, UUID actingUserId) {
		Club existing = getClubById(id);
		Member actingMember = existing.getMembersList().stream()
				.filter(m -> m.getUser() != null && m.getUser().getId().equals(actingUserId))
				.findFirst()
				.orElse(null);
		if (actingMember == null || actingMember.getRole() != MemberRole.ADMIN) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.INSUFFICIENT_PERMISSIONS)
					.title("Insufficient permissions")
					.details("Only admins can update club avatar.")
					.messageParameter("clubId", id.toString())
					.messageParameter("userId", actingUserId.toString())
					.build());
		}
		var stored = objectStorageService.upload("clubs/" + id, avatar, contentType);
		existing.setAvatarBucket(stored.bucket());
		existing.setAvatarObject(stored.objectKey());
		existing.setAvatarEtag(stored.etag());
		clubRepository.update(existing);
	}

	/**
	 * Deletes a club by its identifier.
	 *
	 * @param id
	 *     the club identifier
	 * @return {@code true} if the club was deleted
	 */
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

	/**
	 * Adds a user as a member of the specified club.
	 *
	 * @param clubId
	 *     identifier of the club to join
	 * @param userId
	 *     identifier of the joining user
	 */
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

	/**
	 * Removes a user from the specified club.
	 *
	 * @param clubId
	 *     identifier of the club to leave
	 * @param userId
	 *     identifier of the leaving user
	 */
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

	/**
	 * Changes the role of a club member if the acting user is an admin.
	 *
	 * @param clubId
	 *     club containing the member
	 * @param memberId
	 *     member whose role is to be changed
	 * @param newRole
	 *     new role to assign
	 * @param actingUserId
	 *     user performing the action
	 */
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

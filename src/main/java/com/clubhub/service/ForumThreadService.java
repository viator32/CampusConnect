package com.clubhub.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import com.clubhub.entity.Club;
import com.clubhub.entity.Comment;
import com.clubhub.entity.ForumThread;
import com.clubhub.entity.User;
import com.clubhub.exception.ClubHubErrorCode;
import com.clubhub.exception.ErrorPayload;
import com.clubhub.exception.NotFoundException;
import com.clubhub.exception.ValidationException;
import com.clubhub.repository.CommentRepository;
import com.clubhub.repository.ForumThreadRepository;

@ApplicationScoped
public class ForumThreadService {

	@Inject
	ForumThreadRepository threadRepository;

	@Inject
	CommentRepository commentRepository;

	@Inject
	ClubService clubService;

	@Inject
	UserService userService;

	@Inject
	EntityManager em;

	public List<ForumThread> getThreadsForClub(UUID clubId, int offset, int limit) {
		return threadRepository.findByClub(clubId, offset, limit);
	}

	public ForumThread getThread(UUID id) {
		ForumThread thread = threadRepository.findById(id);
		if (thread == null) {
			throw new NotFoundException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.THREAD_NOT_FOUND)
					.title("Thread not found")
					.details("No thread with id %s exists.".formatted(id))
					.messageParameter("threadId", id.toString())
					.sourcePointer("threadId")
					.build());
		}
		return thread;
	}

	@Transactional
	public ForumThread addThread(UUID clubId, UUID userId, String title, String content) {
		Club club = clubService.getClubById(clubId);
		boolean isMember = club.getMembersList().stream()
				.anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
		if (!isMember) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
					.title("User not a member")
					.details("User must be a member of the club to create threads.")
					.messageParameter("clubId", clubId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		User user = userService.getUserById(userId);
		ForumThread thread = new ForumThread();
		thread.setTitle(title);
		thread.setAuthor(user);
		thread.setReplies(0);
		thread.setLastActivity(LocalDateTime.now().toString());
		thread.setContent(content);
		thread.setClub(club);

		threadRepository.save(thread);
		club.getForumThreads().add(thread);
		em.merge(club);
		return thread;
	}

	@Transactional
	public Comment addReply(UUID threadId, UUID userId, String content) {
		ForumThread thread = getThread(threadId);
		Club club = thread.getClub();
		boolean isMember = club.getMembersList().stream()
				.anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
		if (!isMember) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
					.title("User not a member")
					.details("User must be a member of the club to reply to threads.")
					.messageParameter("threadId", threadId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		User user = userService.getUserById(userId);
		Comment comment = new Comment();
		comment.setAuthor(user);
		comment.setContent(content);
		comment.setLikes(0);
		comment.setTime(LocalDateTime.now().toString());
		comment.setThread(thread);

		commentRepository.save(comment);
		thread.getPosts().add(comment);
		thread.setReplies(thread.getReplies() + 1);
		thread.setLastActivity(comment.getTime());
		threadRepository.update(thread);
		return comment;
	}
}

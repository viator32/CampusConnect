package com.clubhub.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import com.clubhub.entity.Member;
import com.clubhub.entity.MemberRole;
import com.clubhub.entity.Reply;
import com.clubhub.entity.User;
import com.clubhub.exception.ClubHubErrorCode;
import com.clubhub.exception.ErrorPayload;
import com.clubhub.exception.NotFoundException;
import com.clubhub.exception.ValidationException;
import com.clubhub.repository.ForumThreadRepository;
import com.clubhub.repository.ReplyRepository;

@ApplicationScoped
public class ReplyService {

	@Inject
	ReplyRepository replyRepository;

	@Inject
	ForumThreadService threadService;

	@Inject
	ForumThreadRepository threadRepository;

        @Inject
        UserService userService;

        public List<Reply> getReplies(UUID threadId, UUID userId, int offset, int limit) {
                var thread = threadService.getThread(threadId);
                var club = thread.getClub();
                boolean isMember = club.getMembersList().stream()
                                .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
                if (!isMember) {
                        throw new ValidationException(ErrorPayload.builder()
                                        .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                                        .title("User not a member")
                                        .details("User must be a member of the club to view replies.")
                                        .messageParameter("threadId", threadId.toString())
                                        .messageParameter("userId", userId.toString())
                                        .build());
                }
                return replyRepository.findByThread(threadId, offset, limit);
        }

	public Reply getReply(UUID id) {
		Reply reply = replyRepository.findById(id);
		if (reply == null) {
			throw new NotFoundException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.COMMENT_NOT_FOUND)
					.title("Reply not found")
					.details("No reply with id %s exists.".formatted(id))
					.messageParameter("replyId", id.toString())
					.sourcePointer("replyId")
					.build());
		}
		return reply;
	}

	@Transactional
	public Reply addReply(UUID threadId, UUID userId, String content) {
		var thread = threadService.getThread(threadId);
		var club = thread.getClub();
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
		Reply reply = new Reply();
		reply.setAuthor(user);
		reply.setContent(content);
		reply.setUpvotes(0);
		reply.setDownvotes(0);
		reply.setTime(LocalDateTime.now().toString());
		reply.setThread(thread);

		replyRepository.save(reply);
		thread.getReplies().add(reply);
		thread.setReplyCount(thread.getReplyCount() + 1);
		thread.setLastActivity(reply.getTime());
		threadRepository.update(thread);
		return reply;
	}

	@Transactional
	public void upvote(UUID replyId, UUID userId) {
		Reply r = getReply(replyId);
		var club = r.getThread().getClub();
		boolean isMember = club.getMembersList().stream()
				.anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
		if (!isMember) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
					.title("User not a member")
					.details("User must be a member of the club to upvote replies.")
					.messageParameter("replyId", replyId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		if (!replyRepository.hasUserUpvotedReply(replyId, userId)) {
			User user = userService.getUserById(userId);
			r.getUpvotedBy().add(user);
		}
		r.getDownvotedBy().removeIf(u -> u.getId().equals(userId));
		r.setUpvotes(r.getUpvotedBy().size());
		r.setDownvotes(r.getDownvotedBy().size());
		replyRepository.update(r);
	}

	@Transactional
	public void removeUpvote(UUID replyId, UUID userId) {
		Reply r = getReply(replyId);
		var club = r.getThread().getClub();
		boolean isMember = club.getMembersList().stream()
				.anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
		if (!isMember) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
					.title("User not a member")
					.details("User must be a member of the club to remove upvote.")
					.messageParameter("replyId", replyId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		r.getUpvotedBy().removeIf(u -> u.getId().equals(userId));
		r.setUpvotes(r.getUpvotedBy().size());
		replyRepository.update(r);
	}

	@Transactional
	public void downvote(UUID replyId, UUID userId) {
		Reply r = getReply(replyId);
		var club = r.getThread().getClub();
		boolean isMember = club.getMembersList().stream()
				.anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
		if (!isMember) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
					.title("User not a member")
					.details("User must be a member of the club to downvote replies.")
					.messageParameter("replyId", replyId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		if (!replyRepository.hasUserDownvotedReply(replyId, userId)) {
			User user = userService.getUserById(userId);
			r.getDownvotedBy().add(user);
		}
		r.getUpvotedBy().removeIf(u -> u.getId().equals(userId));
		r.setDownvotes(r.getDownvotedBy().size());
		r.setUpvotes(r.getUpvotedBy().size());
		replyRepository.update(r);
	}

	@Transactional
	public void removeDownvote(UUID replyId, UUID userId) {
		Reply r = getReply(replyId);
		var club = r.getThread().getClub();
		boolean isMember = club.getMembersList().stream()
				.anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
		if (!isMember) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
					.title("User not a member")
					.details("User must be a member of the club to remove downvote.")
					.messageParameter("replyId", replyId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		r.getDownvotedBy().removeIf(u -> u.getId().equals(userId));
		r.setDownvotes(r.getDownvotedBy().size());
		replyRepository.update(r);
	}

	@Transactional
	public Reply updateReply(UUID replyId, UUID userId, String content) {
		Reply reply = getReply(replyId);
		User user = userService.getUserById(userId);
		var club = reply.getThread().getClub();
		Member membership = club.getMembersList().stream()
				.filter(m -> m.getUser() != null && m.getUser().getId().equals(userId))
				.findFirst().orElse(null);
		if (membership == null) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
					.title("User not a member")
					.details("User must be a member of the club to update replies.")
					.messageParameter("replyId", replyId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		if (!reply.getAuthor().getId().equals(user.getId())) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.INSUFFICIENT_PERMISSIONS)
					.title("Insufficient permissions")
					.details("Only the author can update this reply.")
					.messageParameter("replyId", replyId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		reply.setContent(content);
		return replyRepository.update(reply);
	}

	@Transactional
	public void deleteReply(UUID replyId, UUID userId) {
		Reply reply = getReply(replyId);
		User user = userService.getUserById(userId);
		var club = reply.getThread().getClub();
		Member membership = club.getMembersList().stream()
				.filter(m -> m.getUser() != null && m.getUser().getId().equals(userId))
				.findFirst().orElse(null);
		if (membership == null) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
					.title("User not a member")
					.details("User must be a member of the club to delete replies.")
					.messageParameter("replyId", replyId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		boolean isAuthor = reply.getAuthor().getId().equals(user.getId());
		if (!isAuthor && membership.getRole() == MemberRole.MEMBER) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.INSUFFICIENT_PERMISSIONS)
					.title("Insufficient permissions")
					.details("Only the author, moderators or admins can delete this reply.")
					.messageParameter("replyId", replyId.toString())
					.messageParameter("userId", userId.toString())
					.build());
		}
		var thread = reply.getThread();
		thread.getReplies().remove(reply);
		thread.setReplyCount(thread.getReplyCount() - 1);
		replyRepository.delete(replyId);
		threadRepository.update(thread);
	}
}

package com.clubhub.service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Set;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import com.clubhub.entity.Comment;
import com.clubhub.entity.Member;
import com.clubhub.entity.MemberRole;
import com.clubhub.entity.Post;
import com.clubhub.entity.User;
import com.clubhub.exception.ClubHubErrorCode;
import com.clubhub.exception.ErrorPayload;
import com.clubhub.exception.NotFoundException;
import com.clubhub.exception.ValidationException;
import com.clubhub.repository.CommentRepository;

@ApplicationScoped
public class CommentService {

    @Inject
    CommentRepository commentRepository;

    @Inject
    PostService postService;

    @Inject
    EntityManager em;

    @Inject
    UserService userService;

    public Comment getComment(UUID id) {
        Comment comment = commentRepository.findById(id);
        if (comment == null) {
            throw new NotFoundException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.COMMENT_NOT_FOUND)
                    .title("Comment not found")
                    .details("No comment with id %s exists.".formatted(id))
                    .messageParameter("commentId", id.toString())
                    .sourcePointer("commentId")
                    .build());
        }
        return comment;
    }

    @Transactional
    public Comment addComment(UUID postId, UUID userId, String content) {
        Post post = postService.getPost(postId);
        // verify that user is member of the club
        Set<Member> members = post.getClub().getMembersList();
        boolean isMember = members.stream()
                .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
        if (!isMember) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                    .title("User not a member")
                    .details("User must be a member of the club to comment.")
                    .messageParameter("postId", postId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        User user = userService.getUserById(userId);
        Comment comment = new Comment();
        comment.setAuthor(user);
        comment.setContent(content);
        comment.setLikes(0);
        comment.setTime(LocalDateTime.now().toString());
        comment.setPost(post);

        commentRepository.save(comment);
        post.getCommentsList().add(comment);
        post.setComments(post.getComments() + 1);
        em.merge(post);
        return comment;
    }

    @Transactional
    public void like(UUID commentId, UUID userId) {
        Comment c = getComment(commentId);
        Post post = c.getPost();
        boolean isMember = post.getClub().getMembersList().stream()
                .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
        if (!isMember) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                    .title("User not a member")
                    .details("User must be a member of the club to like comments.")
                    .messageParameter("commentId", commentId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        if (!commentRepository.hasUserLikedComment(commentId, userId)) {
            User user = userService.getUserById(userId);
            c.getLikedBy().add(user);
            c.setLikes(c.getLikedBy().size());
            commentRepository.update(c);
        }
    }

    @Transactional
    public void unlike(UUID commentId, UUID userId) {
        Comment c = getComment(commentId);
        Post post = c.getPost();
        boolean isMember = post.getClub().getMembersList().stream()
                .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
        if (!isMember) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                    .title("User not a member")
                    .details("User must be a member of the club to unlike comments.")
                    .messageParameter("commentId", commentId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        c.getLikedBy().removeIf(u -> u.getId().equals(userId));
        c.setLikes(c.getLikedBy().size());
        commentRepository.update(c);
    }

    @Transactional
    public Comment updateComment(UUID commentId, UUID userId, String content) {
        Comment comment = getComment(commentId);
        User user = userService.getUserById(userId);
        Post post = comment.getPost();
        Member membership = post.getClub().getMembersList().stream()
                .filter(m -> m.getUser() != null && m.getUser().getId().equals(userId))
                .findFirst().orElse(null);
        if (membership == null) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                    .title("User not a member")
                    .details("User must be a member of the club to update comments.")
                    .messageParameter("commentId", commentId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.INSUFFICIENT_PERMISSIONS)
                    .title("Insufficient permissions")
                    .details("Only the author can update this comment.")
                    .messageParameter("commentId", commentId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        comment.setContent(content);
        return commentRepository.update(comment);
    }

    @Transactional
    public void deleteComment(UUID commentId, UUID userId) {
        Comment comment = getComment(commentId);
        User user = userService.getUserById(userId);
        Post post = comment.getPost();
        Member membership = post.getClub().getMembersList().stream()
                .filter(m -> m.getUser() != null && m.getUser().getId().equals(userId))
                .findFirst().orElse(null);
        if (membership == null) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                    .title("User not a member")
                    .details("User must be a member of the club to delete comments.")
                    .messageParameter("commentId", commentId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        boolean isAuthor = comment.getAuthor().getId().equals(user.getId());
        if (!isAuthor && membership.getRole() == MemberRole.MEMBER) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.INSUFFICIENT_PERMISSIONS)
                    .title("Insufficient permissions")
                    .details("Only the author, moderators or admins can delete this comment.")
                    .messageParameter("commentId", commentId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        Post p = comment.getPost();
        p.getCommentsList().remove(comment);
        p.setComments(p.getComments() - 1);
        commentRepository.delete(commentId);
        em.merge(p);
    }
}

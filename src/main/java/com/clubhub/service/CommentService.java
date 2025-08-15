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
        comment.setAuthor(user.getUsername());
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
    public void like(UUID commentId) {
        Comment c = getComment(commentId);
        c.setLikes(c.getLikes() + 1);
        commentRepository.update(c);
    }
}

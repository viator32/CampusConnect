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
        return commentRepository.findById(id);
    }

    @Transactional
    public Comment addComment(UUID postId, UUID userId, String content) {
        Post post = postService.getPost(postId);
        if (post == null) {
            throw new IllegalArgumentException("Post not found");
        }
        // verify that user is member of the club
        Set<Member> members = post.getClub().getMembersList();
        boolean isMember = members.stream()
                .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
        if (!isMember) {
            throw new IllegalArgumentException("User not a member of this club");
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
        if (c != null) {
            c.setLikes(c.getLikes() + 1);
            commentRepository.update(c);
        }
    }
}

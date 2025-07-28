package com.clubhub.service;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import com.clubhub.entity.Comment;
import com.clubhub.entity.Post;
import com.clubhub.repository.CommentRepository;

@ApplicationScoped
public class CommentService {

    @Inject
    CommentRepository commentRepository;

    @Inject
    PostService postService;

    @Inject
    EntityManager em;

    public Comment getComment(UUID id) {
        return commentRepository.findById(id);
    }

    @Transactional
    public Comment addComment(UUID postId, String author, String content) {
        Post post = postService.getPost(postId);
        if (post == null) {
            throw new IllegalArgumentException("Post not found");
        }
        Comment comment = new Comment();
        comment.setAuthor(author);
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

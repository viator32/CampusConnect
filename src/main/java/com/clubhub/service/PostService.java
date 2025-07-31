package com.clubhub.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import com.clubhub.entity.Club;
import com.clubhub.entity.Member;
import com.clubhub.entity.Post;
import com.clubhub.entity.User;
import com.clubhub.repository.PostRepository;

@ApplicationScoped
public class PostService {

    @Inject
    PostRepository postRepository;

    @Inject
    EntityManager em;

    @Inject
    UserService userService;

    @Inject
    ClubService clubService;

    @Transactional
    public Post createPost(UUID clubId, Post post) {
        Club club = clubService.getClubById(clubId);
        post.setClub(club);
        postRepository.save(post);
        club.getPosts().add(post);
        em.merge(club);
        return post;
    }

    public Post getPost(UUID id) {
        return postRepository.findById(id);
    }

    @Transactional
    public boolean like(UUID postId, UUID userId) {
        Post p = getPost(postId);
        if (p != null) {
            User user = userService.getUserById(userId);
            if (user == null) {
                return false;
            }
            boolean isMember = p.getClub().getMembersList().stream()
                    .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
            if (!isMember) {
                return false;
            }
            boolean alreadyLiked = p.getLikedBy().stream()
                    .anyMatch(u -> u.getId().equals(userId));
            if (!alreadyLiked) {
                p.getLikedBy().add(user);
                p.setLikes(p.getLikedBy().size());
                postRepository.update(p);
            }
            return true;
        }
        return false;
    }

    @Transactional
    public boolean bookmark(UUID postId, UUID userId) {
        Post p = getPost(postId);
        if (p != null) {
            boolean isMember = p.getClub().getMembersList().stream()
                    .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
            if (!isMember) {
                return false;
            }
            p.setBookmarks(p.getBookmarks() + 1);
            postRepository.update(p);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean share(UUID postId, UUID userId) {
        Post p = getPost(postId);
        if (p != null) {
            boolean isMember = p.getClub().getMembersList().stream()
                    .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
            if (!isMember) {
                return false;
            }
            p.setShares(p.getShares() + 1);
            postRepository.update(p);
            return true;
        }
        return false;
    }

    public List<Post> getFeedForUser(UUID userId) {
        User user = userService.getUserById(userId);
        List<Post> feed = new ArrayList<>();
        for (Member m : user.getMemberships()) {
            LocalDateTime joined = m.getJoinedAt();
            for (Post p : m.getClub().getPosts()) {
                LocalDateTime postTime = p.getTime();
                if (joined != null && postTime != null && !postTime.isBefore(joined)) {
                    feed.add(p);
                }
            }
        }
        return feed;
    }
}

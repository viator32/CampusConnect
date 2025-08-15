package com.clubhub.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Comparator;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import com.clubhub.entity.Club;
import com.clubhub.entity.Member;
import com.clubhub.entity.Post;
import com.clubhub.entity.User;
import com.clubhub.exception.ClubHubErrorCode;
import com.clubhub.exception.ErrorPayload;
import com.clubhub.exception.NotFoundException;
import com.clubhub.exception.ValidationException;
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
        Post post = postRepository.findById(id);
        if (post == null) {
            throw new NotFoundException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.POST_NOT_FOUND)
                    .title("Post not found")
                    .details("No post with id %s exists.".formatted(id))
                    .messageParameter("postId", id.toString())
                    .sourcePointer("postId")
                    .build());
        }
        return post;
    }

    @Transactional
    public void like(UUID postId, UUID userId) {
        Post p = getPost(postId);
        User user = userService.getUserById(userId);
        boolean isMember = p.getClub().getMembersList().stream()
                .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
        if (!isMember) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                    .title("User not a member")
                    .details("User must be a member of the club to like posts.")
                    .messageParameter("postId", postId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        boolean alreadyLiked = p.getLikedBy().stream()
                .anyMatch(u -> u.getId().equals(userId));
        if (!alreadyLiked) {
            p.getLikedBy().add(user);
            p.setLikes(p.getLikedBy().size());
            postRepository.update(p);
        }
    }

    @Transactional
    public void bookmark(UUID postId, UUID userId) {
        Post p = getPost(postId);
        boolean isMember = p.getClub().getMembersList().stream()
                .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
        if (!isMember) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                    .title("User not a member")
                    .details("User must be a member of the club to bookmark posts.")
                    .messageParameter("postId", postId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        p.setBookmarks(p.getBookmarks() + 1);
        postRepository.update(p);
    }

    @Transactional
    public void share(UUID postId, UUID userId) {
        Post p = getPost(postId);
        boolean isMember = p.getClub().getMembersList().stream()
                .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
        if (!isMember) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                    .title("User not a member")
                    .details("User must be a member of the club to share posts.")
                    .messageParameter("postId", postId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        p.setShares(p.getShares() + 1);
        postRepository.update(p);
    }

    public List<Post> getFeedForUser(UUID userId, int page, int size) {
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
        return feed.stream()
                .sorted(Comparator.comparing(Post::getTime).reversed())
                .skip((long) page * size)
                .limit(size)
                .toList();
    }
}

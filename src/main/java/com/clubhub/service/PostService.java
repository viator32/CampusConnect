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
import com.clubhub.entity.Post;
import com.clubhub.entity.User;
import com.clubhub.entity.dto.PostDTO;
import com.clubhub.exception.ClubHubErrorCode;
import com.clubhub.exception.ErrorPayload;
import com.clubhub.exception.NotFoundException;
import com.clubhub.exception.ValidationException;
import com.clubhub.repository.MemberRepository;
import com.clubhub.repository.PostRepository;
import com.clubhub.service.ObjectStorageService;

import org.eclipse.microprofile.config.inject.ConfigProperty;

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

    @Inject
    MemberRepository memberRepository;

    @Inject
    ObjectStorageService objectStorageService;

    @ConfigProperty(name = "minio.post-bucket")
    String postBucket;

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
        boolean isMember = memberRepository.existsByClubAndUser(p.getClub().getId(), userId);
        if (!isMember) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                    .title("User not a member")
                    .details("User must be a member of the club to like posts.")
                    .messageParameter("postId", postId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        if (!postRepository.hasUserLikedPost(postId, userId)) {
            p.getLikedBy().add(user);
            p.setLikes(p.getLikedBy().size());
            postRepository.update(p);
        }
    }

    @Transactional
    public void unlike(UUID postId, UUID userId) {
        Post p = getPost(postId);
        boolean isMember = memberRepository.existsByClubAndUser(p.getClub().getId(), userId);
        if (!isMember) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                    .title("User not a member")
                    .details("User must be a member of the club to unlike posts.")
                    .messageParameter("postId", postId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        if (postRepository.hasUserLikedPost(postId, userId)) {
            p.getLikedBy().removeIf(u -> u.getId().equals(userId));
            p.setLikes(p.getLikedBy().size());
            postRepository.update(p);
        }
    }

    @Transactional
    public void bookmark(UUID postId, UUID userId) {
        Post p = getPost(postId);
        boolean isMember = memberRepository.existsByClubAndUser(p.getClub().getId(), userId);
        if (!isMember) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                    .title("User not a member")
                    .details("User must be a member of the club to bookmark posts.")
                    .messageParameter("postId", postId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        User user = userService.getUserById(userId);
        if (!postRepository.hasUserBookmarkedPost(postId, userId)) {
            p.getBookmarkedBy().add(user);
            p.setBookmarks(p.getBookmarkedBy().size());
            postRepository.update(p);
        }
    }

    @Transactional
    public void share(UUID postId, UUID userId) {
        Post p = getPost(postId);
        boolean isMember = memberRepository.existsByClubAndUser(p.getClub().getId(), userId);
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

    public List<Post> getFeedForUser(UUID userId, int offset, int limit) {
        userService.getUserById(userId);
        return postRepository.findFeedForUser(userId, offset, limit);
    }

    public List<Post> getBookmarkedPosts(UUID userId) {
        userService.getUserById(userId);
        return postRepository.findBookmarkedPostsByUser(userId);
    }

    @Transactional
    public void updatePhoto(UUID postId, UUID userId, byte[] photo, String contentType) {
        Post post = getPost(postId);
        Member membership = memberRepository.findByClubAndUser(post.getClub().getId(), userId);
        if (membership == null) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                    .title("User not a member")
                    .details("User must be a member of the club to update posts.")
                    .messageParameter("postId", postId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        boolean isAuthor = post.getAuthor() != null && post.getAuthor().getId().equals(userId);
        if (membership.getRole() == MemberRole.MEMBER && !isAuthor) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.INSUFFICIENT_PERMISSIONS)
                    .title("Insufficient permissions")
                    .details("Members can only update their own posts.")
                    .messageParameter("postId", postId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        var stored = objectStorageService.uploadTo(postBucket, "posts/" + postId, photo, contentType);
        post.setPhotoBucket(stored.bucket());
        post.setPhotoObject(stored.objectKey());
        post.setPhotoEtag(stored.etag());
        postRepository.update(post);
    }

    @Transactional
    public void updatePost(UUID clubId, UUID postId, PostDTO dto, UUID userId) {
        Post post = getPost(postId);
        if (post.getClub() == null || !post.getClub().getId().equals(clubId)) {
            throw new NotFoundException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.POST_NOT_FOUND)
                    .title("Post not found")
                    .details("No post %s for club %s found.".formatted(postId, clubId))
                    .messageParameter("postId", postId.toString())
                    .messageParameter("clubId", clubId.toString())
                    .build());
        }
        User user = userService.getUserById(userId);
        Member membership = memberRepository.findByClubAndUser(post.getClub().getId(), userId);
        if (membership == null) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                    .title("User not a member")
                    .details("User must be a member of the club to update posts.")
                    .messageParameter("postId", postId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        boolean isAuthor = post.getAuthor() != null && post.getAuthor().getId().equals(user.getId());
        if (membership.getRole() == MemberRole.MEMBER && !isAuthor) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.INSUFFICIENT_PERMISSIONS)
                    .title("Insufficient permissions")
                    .details("Members can only update their own posts.")
                    .messageParameter("postId", postId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        post.setContent(dto.content);
        postRepository.update(post);
    }

    @Transactional
    public void deletePost(UUID clubId, UUID postId, UUID userId) {
        Post post = getPost(postId);
        if (post.getClub() == null || !post.getClub().getId().equals(clubId)) {
            throw new NotFoundException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.POST_NOT_FOUND)
                    .title("Post not found")
                    .details("No post %s for club %s found.".formatted(postId, clubId))
                    .messageParameter("postId", postId.toString())
                    .messageParameter("clubId", clubId.toString())
                    .build());
        }
        User user = userService.getUserById(userId);
        Member membership = memberRepository.findByClubAndUser(post.getClub().getId(), userId);
        if (membership == null) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                    .title("User not a member")
                    .details("User must be a member of the club to delete posts.")
                    .messageParameter("postId", postId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        boolean isAuthor = post.getAuthor() != null && post.getAuthor().getId().equals(user.getId());
        if (membership.getRole() == MemberRole.MEMBER && !isAuthor) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.INSUFFICIENT_PERMISSIONS)
                    .title("Insufficient permissions")
                    .details("Members can only delete their own posts.")
                    .messageParameter("postId", postId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        Club club = post.getClub();
        club.getPosts().remove(post);
        postRepository.delete(postId);
        em.merge(club);
    }
}

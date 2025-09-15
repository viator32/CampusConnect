package com.clubhub.entity.mapper;

import java.util.UUID;

import com.clubhub.entity.Club;
import com.clubhub.entity.Post;
import com.clubhub.entity.User;
import com.clubhub.entity.dto.PostDTO;
import com.clubhub.service.ObjectStorageService;

public class PostMapper {

        public static PostDTO toDTO(Post p) {
                return toDTO(p, null);
        }

        public static PostDTO toDTO(Post p, UUID userId) {
                PostDTO dto = new PostDTO();
                dto.setId(p.getId());
                dto.setAuthor(p.getAuthor() != null ? UserMapper.toAuthorDTO(p.getAuthor()) : null);
                dto.setContent(p.getContent());
                dto.setLikes(p.getLikes());
                dto.setComments(p.getComments());
                dto.setBookmarks(p.getBookmarks());
                dto.setShares(p.getShares());
                dto.setTime(p.getTime());
                dto.setPicture(ObjectStorageService.url(p.getPictureBucket(), p.getPictureObject()));

                dto.setPoll(p.getPoll() != null ? PollMapper.toDTO(p.getPoll()) : null);
                dto.setClub(p.getClub() != null ? ClubMapper.toSummaryDTO(p.getClub()) : null);
                dto.setLiked(userId != null && p.getLikedBy().stream().anyMatch(u -> u.getId().equals(userId)));
                return dto;
        }

        public static Post toEntity(PostDTO dto, Club club, User author) {
                Post post = new Post();
                post.setAuthor(author);
                post.setContent(dto.getContent());
                post.setLikes(dto.getLikes());
                post.setComments(dto.getComments());
                post.setBookmarks(dto.getBookmarks());
                post.setShares(dto.getShares());
                post.setTime(dto.getTime());
                post.setClub(club);
                return post;
        }
}

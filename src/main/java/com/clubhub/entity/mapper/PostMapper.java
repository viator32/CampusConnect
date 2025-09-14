package com.clubhub.entity.mapper;

import com.clubhub.entity.Club;
import com.clubhub.entity.Post;
import com.clubhub.entity.User;
import com.clubhub.entity.dto.PostDTO;

public class PostMapper {
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

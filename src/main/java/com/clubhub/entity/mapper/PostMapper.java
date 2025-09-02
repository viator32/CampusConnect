package com.clubhub.entity.mapper;

import com.clubhub.entity.Club;
import com.clubhub.entity.Post;
import com.clubhub.entity.User;
import com.clubhub.entity.dto.PostDTO;

public class PostMapper {
        public static Post toEntity(PostDTO dto, Club club, User author) {
                Post post = new Post();
                post.setAuthor(author);
                post.setContent(dto.content);
                post.setLikes(dto.likes);
                post.setComments(dto.comments);
                post.setBookmarks(dto.bookmarks);
                post.setShares(dto.shares);
                post.setTime(dto.time);
                post.setClub(club);
                return post;
        }
}

package com.clubhub.entity.mapper;

import com.clubhub.entity.Club;
import com.clubhub.entity.Post;
import com.clubhub.entity.dto.PostDTO;

public class PostMapper {
	public static Post toEntity(PostDTO dto, Club club) {
		Post post = new Post();
		post.setAuthor(dto.author);
		post.setContent(dto.content);
		post.setLikes(dto.likes);
		post.setComments(dto.comments);
		post.setBookmarks(dto.bookmarks);
		post.setShares(dto.shares);
		post.setTime(dto.time);
		post.setPhoto(dto.photo);
		post.setClub(club);
		return post;
	}
}

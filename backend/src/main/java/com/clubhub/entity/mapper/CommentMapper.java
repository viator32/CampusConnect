package com.clubhub.entity.mapper;

import java.util.UUID;

import com.clubhub.entity.Comment;
import com.clubhub.entity.dto.CommentDTO;

public class CommentMapper {

	public static CommentDTO toDTO(Comment c) {
		return toDTO(c, null);
	}

	public static CommentDTO toDTO(Comment c, UUID userId) {
		CommentDTO dto = new CommentDTO();
		dto.setId(c.getId());
		dto.setAuthor(c.getAuthor() != null ? UserMapper.toAuthorDTO(c.getAuthor()) : null);
		dto.setContent(c.getContent());
		dto.setTime(c.getTime());
		dto.setLikes(c.getLikes());
		dto.setLiked(userId != null && c.getLikedBy().stream().anyMatch(u -> u.getId().equals(userId)));
		return dto;
	}
}

package com.clubhub.entity.mapper;

import java.util.UUID;

import com.clubhub.entity.ForumThread;
import com.clubhub.entity.dto.ForumThreadDTO;

public class ForumThreadMapper {

	public static ForumThreadDTO toDTO(ForumThread t) {
		return toDTO(t, null);
	}

	public static ForumThreadDTO toDTO(ForumThread t, UUID userId) {
		ForumThreadDTO dto = new ForumThreadDTO();
		dto.setId(t.getId());
		dto.setTitle(t.getTitle());
		dto.setAuthor(t.getAuthor() != null ? UserMapper.toAuthorDTO(t.getAuthor()) : null);
		dto.setReplyCount(t.getReplyCount());
		dto.setLastActivity(t.getLastActivity());
		dto.setContent(t.getContent());
		dto.setUpvotes(t.getUpvotes());
		dto.setDownvotes(t.getDownvotes());
		dto.setUpvoted(userId != null && t.getUpvotedBy().stream().anyMatch(u -> u.getId().equals(userId)));
		dto.setDownvoted(userId != null && t.getDownvotedBy().stream().anyMatch(u -> u.getId().equals(userId)));
		dto.setClub(t.getClub() != null ? ClubMapper.toSummaryDTO(t.getClub()) : null);
		return dto;
	}
}

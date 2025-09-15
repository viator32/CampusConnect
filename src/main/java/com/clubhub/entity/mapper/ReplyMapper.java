package com.clubhub.entity.mapper;

import java.util.UUID;

import com.clubhub.entity.Reply;
import com.clubhub.entity.dto.ReplyDTO;

public class ReplyMapper {

        public static ReplyDTO toDTO(Reply r) {
                return toDTO(r, null);
        }

        public static ReplyDTO toDTO(Reply r, UUID userId) {
                ReplyDTO dto = new ReplyDTO();
                dto.setId(r.getId());
                dto.setAuthor(r.getAuthor() != null ? UserMapper.toAuthorDTO(r.getAuthor()) : null);
                dto.setThreadId(r.getThread() != null ? r.getThread().getId() : null);
                dto.setContent(r.getContent());
                dto.setTime(r.getTime());
                dto.setUpvotes(r.getUpvotes());
                dto.setDownvotes(r.getDownvotes());
                dto.setUpvoted(userId != null && r.getUpvotedBy().stream().anyMatch(u -> u.getId().equals(userId)));
                dto.setDownvoted(userId != null && r.getDownvotedBy().stream().anyMatch(u -> u.getId().equals(userId)));
                return dto;
        }
}

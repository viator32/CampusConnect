package com.clubhub.entity.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MemberDTO {

	private UUID id;
	private UUID clubId;
	private UUID userId;
	private String name;
	private String role;
	private String avatar;
	private LocalDateTime joinedAt;
}

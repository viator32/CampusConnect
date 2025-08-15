package com.clubhub.entity.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class MemberDTO {

	public UUID id;
	public String name;
	public String role;
	public String avatar;
	public LocalDateTime joinedAt;
}

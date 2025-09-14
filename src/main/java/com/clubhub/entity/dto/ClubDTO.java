package com.clubhub.entity.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.clubhub.entity.Preference;
import com.clubhub.entity.Subject;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ClubDTO {
	private UUID id;
	private String name;
	private String description;
	private String category;
	private Subject subject;
	private Preference interest;
	private String location;
	private String avatar;
	private boolean isJoined;
	private int members;
	private int eventsCount;
	private int postsCount;

	private final List<EventDTO> events = new ArrayList<>();
	private final List<MemberDTO> membersList = new ArrayList<>();
	private final List<ForumThreadDTO> forumThreads = new ArrayList<>();
}

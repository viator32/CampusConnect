package com.clubhub.entity.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ClubDTO {
	public UUID id;
	public String name;
        public String description;
        public String category;
        public String image;
        public String location;
        public String avatar;
        public boolean isJoined;
	public int members;
	public int eventsCount;
	public int postsCount;

	public List<EventDTO> events = new ArrayList<>();
	public List<PostDTO> posts = new ArrayList<>();
	public List<MemberDTO> members_list = new ArrayList<>();
	public List<ForumThreadDTO> forum_threads = new ArrayList<>();
}

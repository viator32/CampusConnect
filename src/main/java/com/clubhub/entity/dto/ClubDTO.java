package com.clubhub.entity.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.clubhub.entity.Preference;
import com.clubhub.entity.Subject;

public class ClubDTO {
	public UUID id;
	public String name;
        public String description;
        public String category;
       public Subject subject;
       public Preference interest;
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

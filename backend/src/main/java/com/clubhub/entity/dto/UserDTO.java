package com.clubhub.entity.dto;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.clubhub.entity.Preference;
import com.clubhub.entity.Subject;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDTO {
	private UUID id;
	private String email;
	private String username;
	private String avatar;
	private String description;
	private Set<Preference> preferences;
	private Subject subject;
	private List<MemberDTO> memberships;
	private int clubsJoined;
	private long eventsAttended;
	private long postsCreated;
}

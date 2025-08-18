package com.clubhub.entity.dto;

import java.util.List;
import java.util.UUID;

import com.clubhub.entity.Preference;
import com.clubhub.entity.Subject;

public class UserDTO {

        public UUID id;
        public String email;
        public String username;
        public String avatar;
        public String description;
        public Preference preference;
        public Subject subject;
        public List<MemberDTO> memberships;
        public int clubsJoined;
        public long eventsAttended;
        public long postsCreated;
}

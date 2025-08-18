package com.clubhub.entity.dto;

import java.util.List;
import java.util.UUID;

public class UserDTO {

        public UUID id;
        public String email;
        public String username;
        public String studentId;
        public List<UUID> joinedClubIds;
        public List<MemberDTO> memberships;
}

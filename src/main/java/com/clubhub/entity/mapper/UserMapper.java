package com.clubhub.entity.mapper;

import com.clubhub.entity.Club;
import com.clubhub.entity.User;
import com.clubhub.entity.dto.RegisterDTO;
import com.clubhub.entity.dto.UserDTO;

public class UserMapper {

        public static UserDTO toDTO(User user) {
                UserDTO dto = new UserDTO();
                dto.id = user.getId();
                dto.email = user.getEmail();
                dto.username = user.getUsername();
                dto.studentId = user.getStudentId();
                dto.joinedClubIds = user.getJoinedClubs()
                                .stream()
                                .map(Club::getId)
                                .toList();
                dto.memberships = user.getMemberships()
                                .stream()
                                .map(ClubMapper::toDTO)
                                .toList();
                return dto;
        }

        public static User toEntity(UserDTO dto) {
                User user = new User();
                user.setId(dto.id);
                user.setEmail(dto.email);
                user.setUsername(dto.username);
                user.setStudentId(dto.studentId);
                return user;
        }

        public static User toEntity(RegisterDTO dto) {
                User user = new User();
                user.setEmail(dto.email);
                user.setUsername(dto.username);
                user.setStudentId(dto.studentId);
                return user;
        }
}

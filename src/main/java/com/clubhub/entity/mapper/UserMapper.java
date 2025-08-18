package com.clubhub.entity.mapper;

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
                dto.avatar = user.getAvatar();
                dto.description = user.getDescription();
                dto.preference = user.getPreference();
                dto.subject = user.getSubject();
                dto.memberships = user.getMemberships()
                                .stream()
                                .map(ClubMapper::toDTO)
                                .toList();
                dto.clubsJoined = dto.memberships != null ? dto.memberships.size() : 0;
                return dto;
        }

	public static User toEntity(UserDTO dto) {
		User user = new User();
		user.setId(dto.id);
		user.setEmail(dto.email);
		user.setUsername(dto.username);
                user.setStudentId(dto.studentId);
                user.setAvatar(dto.avatar);
                user.setDescription(dto.description);
                user.setPreference(dto.preference);
                user.setSubject(dto.subject);
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

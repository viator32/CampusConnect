package com.clubhub.entity.mapper;

import com.clubhub.entity.Subject;
import com.clubhub.entity.User;
import com.clubhub.entity.dto.AuthorDTO;
import com.clubhub.entity.dto.RegisterDTO;
import com.clubhub.entity.dto.UserDTO;
import com.clubhub.entity.dto.UserUpdateDTO;
import com.clubhub.service.ObjectStorageService;

public class UserMapper {

	public static UserDTO toDTO(User user) {
		UserDTO dto = toSummaryDTO(user);
		dto.setPreferences(user.getPreferences());
		dto.setSubject(user.getSubject() != null ? user.getSubject() : Subject.NONE);
		dto.setMemberships(user.getMemberships()
				.stream()
				.map(ClubMapper::toDTO)
				.toList());
		dto.setClubsJoined(dto.getMemberships() != null ? dto.getMemberships().size() : 0);
		return dto;
	}

	public static UserDTO toSummaryDTO(User user) {
		UserDTO dto = new UserDTO();
		dto.setId(user.getId());
		dto.setEmail(user.getEmail());
		dto.setUsername(user.getUsername());
		dto.setAvatar(ObjectStorageService.url(user.getAvatarBucket(), user.getAvatarObject()));
		dto.setDescription(user.getDescription());
		return dto;
	}

	public static AuthorDTO toAuthorDTO(User user) {
		AuthorDTO dto = new AuthorDTO();
		dto.setId(user.getId());
		dto.setUsername(user.getUsername());
		dto.setAvatar(ObjectStorageService.url(user.getAvatarBucket(), user.getAvatarObject()));
		return dto;
	}

	public static User toEntity(UserDTO dto) {
		User user = new User();
		user.setId(dto.getId());
		user.setEmail(dto.getEmail());
		user.setUsername(dto.getUsername());
		// avatar handled separately
		user.setDescription(dto.getDescription());
		user.setPreferences(dto.getPreferences());
		user.setSubject(dto.getSubject());
		return user;
	}

	public static User toEntity(UserUpdateDTO dto) {
		User user = new User();
		user.setEmail(dto.getEmail());
		user.setUsername(dto.getUsername());
		user.setDescription(dto.getDescription());
		user.setPreferences(dto.getPreferences());
		user.setSubject(dto.getSubject());
		return user;
	}

	public static User toEntity(RegisterDTO dto) {
		User user = new User();
		user.setEmail(dto.getEmail());
		user.setUsername(dto.getUsername());
		return user;
	}
}

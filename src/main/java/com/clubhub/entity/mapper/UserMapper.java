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
                UserDTO dto = new UserDTO();
                dto.id = user.getId();
                dto.email = user.getEmail();
                dto.username = user.getUsername();
                dto.avatar = ObjectStorageService.url(user.getAvatarBucket(), user.getAvatarObject());
                dto.description = user.getDescription();
               dto.preferences = user.getPreferences();
                dto.subject = user.getSubject() != null ? user.getSubject() : Subject.NONE;
                dto.memberships = user.getMemberships()
                                .stream()
                                .map(ClubMapper::toDTO)
                                .toList();
                dto.clubsJoined = dto.memberships != null ? dto.memberships.size() : 0;
                return dto;
        }

        public static UserDTO toSummaryDTO(User user) {
                UserDTO dto = new UserDTO();
                dto.id = user.getId();
                dto.email = user.getEmail();
                dto.username = user.getUsername();
                dto.avatar = ObjectStorageService.url(user.getAvatarBucket(), user.getAvatarObject());
                dto.description = user.getDescription();
                return dto;
        }

       public static AuthorDTO toAuthorDTO(User user) {
                AuthorDTO dto = new AuthorDTO();
                dto.id = user.getId();
                dto.username = user.getUsername();
                dto.avatar = ObjectStorageService.url(user.getAvatarBucket(), user.getAvatarObject());
                return dto;
       }

        public static User toEntity(UserDTO dto) {
                User user = new User();
                user.setId(dto.id);
                user.setEmail(dto.email);
                user.setUsername(dto.username);
                // avatar handled separately
                user.setDescription(dto.description);
               user.setPreferences(dto.preferences);
               user.setSubject(dto.subject);
               return user;
       }

       public static User toEntity(UserUpdateDTO dto) {
               User user = new User();
               user.setEmail(dto.email);
               user.setUsername(dto.username);
               user.setDescription(dto.description);
               user.setPreferences(dto.preferences);
               user.setSubject(dto.subject);
               return user;
       }

        public static User toEntity(RegisterDTO dto) {
                User user = new User();
                user.setEmail(dto.email);
                user.setUsername(dto.username);
                return user;
        }
}

package com.clubhub.entity.mapper;

import java.util.UUID;

import com.clubhub.entity.Club;
import com.clubhub.entity.dto.ClubDTO;
import com.clubhub.service.ObjectStorageService;

public class ClubMapper {

	public static ClubDTO toDTO(Club club) {
		return toDTO(club, null);
	}

        public static ClubDTO toDTO(Club club, UUID userId) {
                ClubDTO dto = toSummaryDTO(club);

                dto.getMembersList().addAll(club.getMembersList().stream().map(MemberMapper::toDTO).toList());

                return dto;
        }

	public static ClubDTO toSummaryDTO(Club club) {
		ClubDTO dto = new ClubDTO();
		dto.setId(club.getId());
		dto.setName(club.getName());
		dto.setDescription(club.getDescription());
		dto.setCategory(club.getCategory());
		dto.setSubject(club.getSubject());
		dto.setInterest(club.getInterest());
		dto.setLocation(club.getLocation());
		dto.setAvatar(ObjectStorageService.url(club.getAvatarBucket(), club.getAvatarObject()));
		dto.setJoined(club.isJoined());
		dto.setMembers(club.getMembersList() != null ? club.getMembersList().size() : 0);
		dto.setEventsCount(club.getEvents() != null ? club.getEvents().size() : 0);
		dto.setPostsCount(club.getPosts() != null ? club.getPosts().size() : 0);
		return dto;
	}

	public static Club toEntity(ClubDTO dto) {
		Club club = new Club();

		if (dto.getId() != null) {
			club.setId(dto.getId());
		}

		club.setName(dto.getName());
		club.setDescription(dto.getDescription());
		club.setCategory(dto.getCategory());
		club.setSubject(dto.getSubject());
		club.setInterest(dto.getInterest());
		club.setLocation(dto.getLocation());
		// avatar handled separately
		club.setJoined(dto.isJoined());
                club.setMembers(dto.getMembers());

                return club;
        }
}

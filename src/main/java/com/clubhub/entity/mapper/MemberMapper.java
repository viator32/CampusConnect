package com.clubhub.entity.mapper;

import com.clubhub.entity.Member;
import com.clubhub.entity.dto.MemberDTO;
import com.clubhub.service.ObjectStorageService;

public class MemberMapper {

        public static MemberDTO toDTO(Member m) {
                MemberDTO dto = new MemberDTO();
                dto.setId(m.getId());
                dto.setClubId(m.getClub() != null ? m.getClub().getId() : null);
                dto.setUserId(m.getUser() != null ? m.getUser().getId() : null);
                dto.setRole(m.getRole() != null ? m.getRole().name() : null);
                dto.setAvatar((m.getUser() != null)
                                ? ObjectStorageService.url(m.getUser().getAvatarBucket(), m.getUser().getAvatarObject())
                                : null);
                dto.setJoinedAt(m.getJoinedAt());

                if (m.getUser() != null) {
                        dto.setName(m.getUser().getUsername());
                }

                return dto;
        }
}

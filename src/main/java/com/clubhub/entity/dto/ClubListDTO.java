package com.clubhub.entity.dto;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ClubListDTO {
	private List<ClubDTO> clubs;
	private long totalCount;
}

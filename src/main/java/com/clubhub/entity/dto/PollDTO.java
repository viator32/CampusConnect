package com.clubhub.entity.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PollDTO {
	private String question;
	private final List<PollOptionDTO> options = new ArrayList<>();
}

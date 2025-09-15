package com.clubhub.entity.mapper;

import com.clubhub.entity.Poll;
import com.clubhub.entity.PollOption;
import com.clubhub.entity.dto.PollDTO;
import com.clubhub.entity.dto.PollOptionDTO;

public class PollMapper {

	public static PollDTO toDTO(Poll poll) {
		PollDTO dto = new PollDTO();
		dto.setQuestion(poll.getQuestion());
		dto.getOptions().addAll(poll.getOptions().stream().map(PollMapper::toOptionDTO).toList());
		return dto;
	}

	public static PollOptionDTO toOptionDTO(PollOption opt) {
		PollOptionDTO dto = new PollOptionDTO();
		dto.setText(opt.getText());
		dto.setVotes(opt.getVotes());
		return dto;
	}
}

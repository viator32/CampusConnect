package com.clubhub.entity.dto;

import java.util.ArrayList;
import java.util.List;

public class PollDTO {

	public String question;
	public List<PollOptionDTO> options = new ArrayList<>();
}

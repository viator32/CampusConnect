package com.clubhub.entity.dto;

import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CommentDTO {

	private UUID id;
	private AuthorDTO author;
	private String content;
	private String time;
	private int likes;
	private boolean liked;
}

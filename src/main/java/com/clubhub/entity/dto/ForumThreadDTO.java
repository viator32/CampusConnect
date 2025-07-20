package com.clubhub.entity.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ForumThreadDTO {

	public UUID id;
	public String title;
	public String author;
	public int replies;
	public String lastActivity;
	public String content;
	public List<CommentDTO> posts = new ArrayList<>();
}

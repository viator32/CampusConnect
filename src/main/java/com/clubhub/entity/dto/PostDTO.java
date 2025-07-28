package com.clubhub.entity.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class PostDTO {

	public UUID id;
	public String author;
	public String content;
        public int likes;
        public int comments;
        public int bookmarks;
        public int shares;
        public LocalDateTime time;
        public String photo;

	public PollDTO poll;
	public List<CommentDTO> commentsList = new ArrayList<>();

}

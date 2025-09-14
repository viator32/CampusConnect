package com.clubhub.entity.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PostDTO {

	private UUID id;
	private AuthorDTO author;
	private String content;
	private int likes;
	private int comments;
	private int bookmarks;
	private int shares;
	private LocalDateTime time;
	private String picture;

        private PollDTO poll;
        private ClubDTO club;
        private boolean liked;

}

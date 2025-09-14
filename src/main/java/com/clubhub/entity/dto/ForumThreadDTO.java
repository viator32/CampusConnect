package com.clubhub.entity.dto;

import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ForumThreadDTO {

    private UUID id;
    private String title;
    private AuthorDTO author;
    private int replyCount;
    private String lastActivity;
    private String content;
    private int upvotes;
    private int downvotes;
    private boolean upvoted;
    private boolean downvoted;
    private ClubDTO club;
}

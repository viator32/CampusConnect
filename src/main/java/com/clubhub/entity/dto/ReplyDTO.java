package com.clubhub.entity.dto;

import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing a reply on a forum thread.
 */
@Data
@NoArgsConstructor
public class ReplyDTO {
    private UUID id;
    private AuthorDTO author;
    private String content;
    private String time;
    private int upvotes;
    private int downvotes;
    private boolean upvoted;
    private boolean downvoted;
}


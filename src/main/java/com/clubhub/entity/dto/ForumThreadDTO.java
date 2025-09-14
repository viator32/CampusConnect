package com.clubhub.entity.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ForumThreadDTO {

        public UUID id;
        public String title;
        public AuthorDTO author;
        public int replies;
        public String lastActivity;
        public String content;
        public int upvotes;
        public int downvotes;
        public boolean upvoted;
        public boolean downvoted;
        public List<CommentDTO> commentsList = new ArrayList<>();
        public ClubDTO club;
}

package com.clubhub.entity.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FeedDTO {
        private final List<PostDTO> posts = new ArrayList<>();
        private final List<EventDTO> events = new ArrayList<>();
}

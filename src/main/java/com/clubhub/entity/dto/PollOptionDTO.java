package com.clubhub.entity.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PollOptionDTO {

        private String text;
        private int votes;
}

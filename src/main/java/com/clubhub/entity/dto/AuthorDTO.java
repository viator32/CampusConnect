package com.clubhub.entity.dto;

import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthorDTO {
        private UUID id;
        private String username;
        private String avatar;
}

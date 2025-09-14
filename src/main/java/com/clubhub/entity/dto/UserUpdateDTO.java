package com.clubhub.entity.dto;

import java.util.Set;

import com.clubhub.entity.Preference;
import com.clubhub.entity.Subject;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserUpdateDTO {
        private String email;
        private String username;
        private String description;
        private Set<Preference> preferences;
        private Subject subject;
}

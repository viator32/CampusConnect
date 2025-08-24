package com.clubhub.entity.dto;

import java.util.Set;

import com.clubhub.entity.Preference;
import com.clubhub.entity.Subject;

public class UserUpdateDTO {
        public String email;
        public String username;
        public String description;
        public Set<Preference> preferences;
        public Subject subject;
}

package com.clubhub.entity.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserPasswordUpdateDTO {
        private String currentPassword;
        private String newPassword;
}

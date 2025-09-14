package com.clubhub.entity.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegisterDTO {
	private String email;
	private String username;
	private String password;
}

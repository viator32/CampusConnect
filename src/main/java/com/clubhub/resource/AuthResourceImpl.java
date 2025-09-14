package com.clubhub.resource;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.HeaderParam;

import com.clubhub.entity.dto.ActionResponseDTO;
import com.clubhub.entity.dto.AuthRequestDTO;
import com.clubhub.entity.dto.AuthResponseDTO;
import com.clubhub.entity.dto.RegisterDTO;
import com.clubhub.entity.mapper.UserMapper;
import com.clubhub.exception.ClubHubErrorCode;
import com.clubhub.exception.ErrorPayload;
import com.clubhub.exception.UnauthorizedException;
import com.clubhub.exception.ValidationException;
import com.clubhub.service.AuthService;
import com.clubhub.service.UserService;

@RequestScoped
public class AuthResourceImpl implements AuthResource {

	@Inject
	UserService userService;
	@Inject
	AuthService authService;

	@Override
	public AuthResponseDTO register(RegisterDTO register) {
                if (register.getEmail() == null || !register.getEmail().endsWith("@study.thws.de")) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.INVALID_CREDENTIALS)
					.title("Invalid email")
					.details("Email must end with @study.thws.de")
                                        .messageParameter("email", register.getEmail())
                                        .sourcePointer("email")
					.build());
		}
                if (userService.getUserByEmail(register.getEmail()) != null) {
			throw new ValidationException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.USER_ALREADY_EXISTS)
					.title("User already exists")
					.details("A user with this email already exists.")
                                        .messageParameter("email", register.getEmail())
                                        .sourcePointer("email")
					.build());
		}
                var user = UserMapper.toEntity(register);
                userService.createUser(user, register.getPassword());
		String token = authService.createToken(user.getId());
		return new AuthResponseDTO(token);
	}

	@Override
	public AuthResponseDTO login(AuthRequestDTO request) {
                var user = userService.authenticate(request.getEmail(), request.getPassword());
		String token = authService.createToken(user.getId());
		return new AuthResponseDTO(token);
	}

	@Override
	public AuthResponseDTO refresh(@HeaderParam("Authorization") String authorization, AuthResponseDTO tokenDto) {
                String token = tokenDto != null ? tokenDto.getToken() : null;
		if (token == null && authorization != null && authorization.startsWith("Bearer ")) {
			token = authorization.substring("Bearer ".length());
		}
		if (token != null && token.startsWith("Bearer ")) {
			token = token.substring("Bearer ".length());
		}
		String newToken = authService.refreshToken(token);
		if (newToken == null) {
			throw new UnauthorizedException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.INVALID_TOKEN)
					.title("Invalid token")
					.details("Token could not be refreshed.")
					.build());
		}
		return new AuthResponseDTO(newToken);
	}

	@Override
	public ActionResponseDTO logout(@HeaderParam("Authorization") String authorization, AuthResponseDTO tokenDto) {
                String token = tokenDto != null ? tokenDto.getToken() : null;
		if (token == null && authorization != null && authorization.startsWith("Bearer ")) {
			token = authorization.substring("Bearer ".length());
		}
		if (token != null && token.startsWith("Bearer ")) {
			token = token.substring("Bearer ".length());
		}
		boolean success = authService.logout(token);
		if (!success) {
			throw new UnauthorizedException(ErrorPayload.builder()
					.errorCode(ClubHubErrorCode.INVALID_TOKEN)
					.title("Invalid token")
					.details("Token could not be invalidated.")
					.build());
		}
		return new ActionResponseDTO(true, "Logged out");
	}
}

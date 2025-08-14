package com.clubhub.resource;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.core.Response;

import com.clubhub.entity.dto.AuthRequestDTO;
import com.clubhub.entity.dto.AuthResponseDTO;
import com.clubhub.entity.dto.RegisterDTO;
import com.clubhub.entity.mapper.UserMapper;
import com.clubhub.service.AuthService;
import com.clubhub.service.UserService;

@RequestScoped
public class AuthResourceImpl implements AuthResource {

    @Inject
    UserService userService;
    @Inject
    AuthService authService;

    @Override
    public Response register(RegisterDTO register) {
        if (register.email == null || !register.email.endsWith("@study.thws.de")) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        if (userService.getUserByEmail(register.email) != null) {
            return Response.status(Response.Status.CONFLICT).build();
        }
        var user = UserMapper.toEntity(register);
        userService.createUser(user, register.password);
        String token = authService.createToken(user.getId());
        return Response.status(Response.Status.CREATED).entity(new AuthResponseDTO(token)).build();
    }

    @Override
    public Response login(AuthRequestDTO request) {
        var user = userService.authenticate(request.email, request.password);
        if (user == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        String token = authService.createToken(user.getId());
        return Response.ok(new AuthResponseDTO(token)).build();
    }

    @Override
    public Response refresh(@HeaderParam("Authorization") String authorization, AuthResponseDTO tokenDto) {
        String token = tokenDto != null ? tokenDto.token : null;
        if (token == null && authorization != null && authorization.startsWith("Bearer ")) {
            token = authorization.substring("Bearer ".length());
        }
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring("Bearer ".length());
        }
        String newToken = authService.refreshToken(token);
        if (newToken == null) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        return Response.ok(new AuthResponseDTO(newToken)).build();
    }

    @Override
    public Response logout(@HeaderParam("Authorization") String authorization, AuthResponseDTO tokenDto) {
        String token = tokenDto != null ? tokenDto.token : null;
        if (token == null && authorization != null && authorization.startsWith("Bearer ")) {
            token = authorization.substring("Bearer ".length());
        }
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring("Bearer ".length());
        }
        boolean success = authService.logout(token);
        if (!success) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        return Response.noContent().build();
    }
}

package com.clubhub.resource;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import com.clubhub.entity.dto.AuthRequestDTO;
import com.clubhub.entity.dto.RegisterDTO;
import com.clubhub.entity.dto.AuthResponseDTO;

@Path("/api/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface AuthResource {

    @POST
    @Path("/register")
    Response register(RegisterDTO register);

    @POST
    @Path("/login")
    Response login(AuthRequestDTO request);

    @POST
    @Path("/refresh")
    Response refresh(AuthResponseDTO token);
}

package com.clubhub.resource;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.jboss.resteasy.reactive.RestResponse.StatusCode;

import com.clubhub.entity.dto.AuthRequestDTO;
import com.clubhub.entity.dto.AuthResponseDTO;
import com.clubhub.entity.dto.RegisterDTO;
import com.clubhub.entity.dto.ActionResponseDTO;

@Path("/api/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface AuthResource {

        @POST
        @Path("/register")
        @StatusCode(201)
        AuthResponseDTO register(RegisterDTO register);

	@POST
	@Path("/login")
        AuthResponseDTO login(AuthRequestDTO request);

	@POST
	@Path("/refresh")
        AuthResponseDTO refresh(@HeaderParam("Authorization") String authorization, AuthResponseDTO token);

	@POST
	@Path("/logout")
        ActionResponseDTO logout(@HeaderParam("Authorization") String authorization, AuthResponseDTO token);
}

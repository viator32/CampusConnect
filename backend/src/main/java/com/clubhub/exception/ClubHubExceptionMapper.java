package com.clubhub.exception;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

/**
 * Maps {@link ClubHubException} to HTTP responses with structured payloads.
 */
@Provider
public class ClubHubExceptionMapper implements ExceptionMapper<ClubHubException> {

	@Override
	public Response toResponse(ClubHubException exception) {
		return Response.status(exception.getStatus())
				.entity(exception.getPayload())
				.build();
	}
}

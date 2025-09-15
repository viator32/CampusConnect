package com.clubhub.exception;

import jakarta.ws.rs.core.Response.Status;

/**
 * Exception indicating that authentication failed or was not provided.
 */
public class UnauthorizedException extends ClubHubException {

	public UnauthorizedException(ErrorPayload payload) {
		super(payload);
	}

	@Override
	public Status getStatus() {
		return Status.UNAUTHORIZED;
	}
}

package com.clubhub.exception;

import jakarta.ws.rs.core.Response.Status;

/**
 * Exception indicating that a requested resource was not found.
 */
public class NotFoundException extends ClubHubException {

	public NotFoundException(ErrorPayload payload) {
		super(payload);
	}

	@Override
	public Status getStatus() {
		return Status.NOT_FOUND;
	}
}

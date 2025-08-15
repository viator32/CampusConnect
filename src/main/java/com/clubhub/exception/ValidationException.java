package com.clubhub.exception;

import jakarta.ws.rs.core.Response.Status;

/**
 * Exception indicating a validation error.
 */
public class ValidationException extends ClubHubException {

	public ValidationException(ErrorPayload payload) {
		super(payload);
	}

	@Override
	public Status getStatus() {
		return Status.BAD_REQUEST;
	}
}

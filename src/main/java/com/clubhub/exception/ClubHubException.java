package com.clubhub.exception;

import jakarta.ws.rs.core.Response.Status;

import lombok.Getter;

/**
 * Base class for all custom exceptions in the application.
 */
@Getter
public abstract class ClubHubException extends RuntimeException {

	private final transient ErrorPayload payload;

	protected ClubHubException(ErrorPayload payload) {
		super(payload != null ? payload.getTitle() : null);
		this.payload = payload;
	}

	/**
	 * HTTP status that should be returned for this exception.
	 */
	public abstract Status getStatus();
}

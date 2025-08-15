package com.clubhub.exception;

import java.util.Map;

import lombok.Builder;
import lombok.Getter;
import lombok.Singular;

/**
 * Payload that describes an error in a structured way.
 */
@Getter
@Builder
public class ErrorPayload {

    /** Specific error code. */
    private final String errorCode;

    /** Short title describing the error. */
    private final String title;

    /** Detailed description. */
    private final String details;

    /** Additional parameters helpful to compose messages. */
    @Singular("messageParameter")
    private final Map<String, String> messageParameters;

    /** Pointer to the source of the error (e.g. field name). */
    private final String sourcePointer;
}


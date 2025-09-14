package com.clubhub.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AuthService {
	private static final long TOKEN_VALIDITY_MINUTES = 15;

	private record TokenInfo(UUID userId, Instant expiresAt) {
	}

	private final Map<String, TokenInfo> tokens = new ConcurrentHashMap<>();

	/**
	 * Generates a new authentication token for the specified user.
	 *
	 * @param userId
	 *     the identifier of the user requesting a token
	 * @return a newly generated token string
	 */
	public String createToken(UUID userId) {
		String token = UUID.randomUUID().toString();
		tokens.put(token, new TokenInfo(userId, Instant.now().plus(TOKEN_VALIDITY_MINUTES, ChronoUnit.MINUTES)));
		return token;
	}

	/**
	 * Validates the provided token and returns the associated user ID if valid.
	 *
	 * @param token
	 *     the token to validate
	 * @return the user ID tied to the token or {@code null} if invalid
	 */
	public UUID validateToken(String token) {
		TokenInfo info = tokens.get(token);
		if (info == null || info.expiresAt.isBefore(Instant.now())) {
			return null;
		}
		return info.userId;
	}

	/**
	 * Refreshes the given token, returning a new token if the original is valid.
	 *
	 * @param token
	 *     the token to refresh
	 * @return a new token or {@code null} if the original token is invalid
	 */
	public String refreshToken(String token) {
		if (token == null) {
			return null;
		}
		if (token.startsWith("Bearer ")) {
			token = token.substring("Bearer ".length());
		}
		TokenInfo info = tokens.get(token);
		if (info == null || info.expiresAt.isBefore(Instant.now())) {
			return null;
		}
		tokens.remove(token);
		return createToken(info.userId);
	}

	/**
	 * Invalidates the given token, logging the user out if the token exists.
	 *
	 * @param token
	 *     the token to invalidate
	 * @return {@code true} if the token was removed, otherwise {@code false}
	 */
	public boolean logout(String token) {
		if (token == null) {
			return false;
		}
		if (token.startsWith("Bearer ")) {
			token = token.substring("Bearer ".length());
		}
		return tokens.remove(token) != null;
	}
}

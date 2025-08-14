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

    private record TokenInfo(UUID userId, Instant expiresAt) {}

    private final Map<String, TokenInfo> tokens = new ConcurrentHashMap<>();

    public String createToken(UUID userId) {
        String token = UUID.randomUUID().toString();
        tokens.put(token, new TokenInfo(userId, Instant.now().plus(TOKEN_VALIDITY_MINUTES, ChronoUnit.MINUTES)));
        return token;
    }

    public UUID validateToken(String token) {
        TokenInfo info = tokens.get(token);
        if (info == null || info.expiresAt.isBefore(Instant.now())) {
            return null;
        }
        return info.userId;
    }

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

package com.clubhub.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AuthService {
    private final Map<String, UUID> tokens = new ConcurrentHashMap<>();

    public String createToken(UUID userId) {
        String token = UUID.randomUUID().toString();
        tokens.put(token, userId);
        return token;
    }

    public UUID getUserId(String token) {
        return tokens.get(token);
    }
}

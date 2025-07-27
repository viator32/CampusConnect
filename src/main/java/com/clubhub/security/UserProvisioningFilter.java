package com.clubhub.security;

import java.io.IOException;
import java.util.UUID;

import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.ext.Provider;

import io.quarkus.security.identity.SecurityIdentity;
import io.smallrye.jwt.auth.principal.JsonWebToken;

import com.clubhub.entity.User;
import com.clubhub.service.UserService;

/**
 * Ensures that a User entity exists for the currently authenticated Keycloak user.
 * If the user does not exist in the database, it will be created automatically.
 */
@Provider
@Priority(Priorities.AUTHENTICATION)
public class UserProvisioningFilter implements ContainerRequestFilter {

    @Inject
    SecurityIdentity identity;

    @Inject
    JsonWebToken jwt;

    @Inject
    UserService userService;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        if (identity.isAnonymous()) {
            return;
        }
        UUID userId = UUID.fromString(identity.getPrincipal().getName());
        if (userService.getUserById(userId) == null) {
            User user = new User();
            user.setId(userId);
            user.setEmail(jwt.getClaim("email"));
            user.setUsername(jwt.getClaim("preferred_username"));
            userService.createUser(user);
        }
    }
}

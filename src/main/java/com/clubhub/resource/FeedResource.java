package com.clubhub.resource;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;

import com.clubhub.entity.dto.FeedDTO;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface FeedResource {

        @GET
        @Path("/feed")
        FeedDTO getFeed(@Context ContainerRequestContext ctx,
                        @QueryParam("postOffset") @DefaultValue("0") int postOffset,
                        @QueryParam("postLimit") @DefaultValue("10") int postLimit,
                        @QueryParam("eventOffset") @DefaultValue("0") int eventOffset,
                        @QueryParam("eventLimit") @DefaultValue("10") int eventLimit);
}

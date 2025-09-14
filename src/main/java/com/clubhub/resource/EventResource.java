package com.clubhub.resource;

import java.util.UUID;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;

import com.clubhub.entity.dto.CsvExportDTO;
import com.clubhub.entity.dto.EventDTO;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface EventResource {

	@GET
	@Path("/events/{eventId}")
	EventDTO getEvent(@PathParam("eventId") UUID eventId, @Context ContainerRequestContext ctx);

	@GET
	@Path("/events/{eventId}/attendees/csv")
	CsvExportDTO downloadAttendees(@PathParam("eventId") UUID eventId, @Context ContainerRequestContext ctx);
}

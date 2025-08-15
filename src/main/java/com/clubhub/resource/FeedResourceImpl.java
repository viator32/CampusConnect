package com.clubhub.resource;

import java.util.UUID;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;

import com.clubhub.entity.dto.FeedDTO;
import com.clubhub.entity.mapper.ClubMapper;
import com.clubhub.entity.mapper.EventMapper;
import com.clubhub.service.EventService;
import com.clubhub.service.PostService;

@RequestScoped
public class FeedResourceImpl implements FeedResource {

	@Inject
	PostService postService;

	@Inject
	EventService eventService;

	@Override
	public FeedDTO getFeed(@Context ContainerRequestContext ctx, int page, int size) {
		UUID userId = (UUID) ctx.getProperty("userId");
		FeedDTO feed = new FeedDTO();
		feed.posts = postService.getFeedForUser(userId, page, size).stream()
				.map(ClubMapper::toDTO)
				.toList();
		feed.events = eventService.getFeedForUser(userId, page, size).stream()
				.map(EventMapper::toDTO)
				.toList();
		return feed;
	}
}

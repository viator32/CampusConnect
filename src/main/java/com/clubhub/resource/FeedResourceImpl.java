package com.clubhub.resource;

import java.util.UUID;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;

import com.clubhub.entity.dto.FeedDTO;
import com.clubhub.entity.mapper.EventMapper;
import com.clubhub.entity.mapper.PostMapper;
import com.clubhub.service.EventService;
import com.clubhub.service.PostService;

@RequestScoped
public class FeedResourceImpl implements FeedResource {

	@Inject
	PostService postService;

	@Inject
	EventService eventService;

	@Override
	public FeedDTO getFeed(@Context ContainerRequestContext ctx, int postOffset, int postLimit,
			int eventOffset, int eventLimit) {
		UUID userId = (UUID) ctx.getProperty("userId");
		FeedDTO feed = new FeedDTO();
                feed.getPosts().addAll(postService.getFeedForUser(userId, postOffset, postLimit).stream()
                                .map(p -> PostMapper.toDTO(p, userId))
                                .toList());
		feed.getEvents().addAll(eventService.getFeedForUser(userId, eventOffset, eventLimit).stream()
				.map(EventMapper::toDTO)
				.toList());
		return feed;
	}
}

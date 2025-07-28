package com.clubhub.resource;

import java.net.URI;
import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import com.clubhub.entity.dto.PostDTO;
import com.clubhub.entity.mapper.ClubMapper;
import com.clubhub.entity.mapper.PostMapper;
import com.clubhub.service.PostService;
import com.clubhub.service.ClubService;

@RequestScoped
public class PostResourceImpl implements PostResource {

    @Inject
    PostService postService;

    @Inject
    ClubService clubService;

    @Override
    public List<PostDTO> getClubPosts(UUID clubId) {
        var club = clubService.getClubById(clubId);
        return club.getPosts().stream().map(ClubMapper::toDTO).toList();
    }

    @Override
    public Response create(UUID clubId, PostDTO dto) {
        var post = PostMapper.toEntity(dto, clubService.getClubById(clubId));
        postService.createPost(clubId, post);
        return Response.created(URI.create("/api/clubs/" + clubId + "/posts/" + post.getId())).build();
    }

    @Override
    public Response like(UUID postId) {
        postService.like(postId);
        return Response.ok().build();
    }

    @Override
    public Response bookmark(UUID postId) {
        postService.bookmark(postId);
        return Response.ok().build();
    }

    @Override
    public Response share(UUID postId) {
        postService.share(postId);
        return Response.ok().build();
    }

    @Override
    public List<PostDTO> getFeed(UUID userId) {
        return postService.getFeedForUser(userId).stream().map(ClubMapper::toDTO).toList();
    }
}

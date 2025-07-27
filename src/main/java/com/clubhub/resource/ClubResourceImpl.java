package com.clubhub.resource;

import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import io.quarkus.security.identity.SecurityIdentity;

import com.clubhub.entity.Club;
import com.clubhub.entity.dto.ClubDTO;
import com.clubhub.entity.mapper.ClubMapper;
import com.clubhub.service.ClubService;

@RequestScoped
public class ClubResourceImpl implements ClubResource {

        @Inject
        ClubService clubService;

        @Inject
        SecurityIdentity identity;

	@Override
	public List<ClubDTO> getAll() {
		return clubService.getAllClubs().stream()
				.map(ClubMapper::toDTO)
				.toList();
	}

	@Override
	public Response getById(UUID id) {
		Club club = clubService.getClubById(id);
		if (club == null) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}
		return Response.ok(ClubMapper.toDTO(club)).build();
	}

	@Override
	public Response create(ClubDTO clubDto) {
		Club created = clubService.createClub(ClubMapper.toEntity(clubDto));
		return Response.status(Response.Status.CREATED)
				.entity(ClubMapper.toDTO(created))
				.build();
	}

	@Override
	public Response update(UUID id, ClubDTO clubDto) {
		Club updated = clubService.updateClub(id, ClubMapper.toEntity(clubDto));
		if (updated == null) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}
		return Response.ok(ClubMapper.toDTO(updated)).build();
	}

	@Override
	public Response delete(UUID id) {
		boolean deleted = clubService.deleteClub(id);
		if (!deleted) {
			return Response.status(Response.Status.NOT_FOUND).build();
		}
		return Response.noContent().build();
	}

    @Override
    public Response joinClub(UUID clubId) {
            UUID userId = UUID.fromString(identity.getPrincipal().getName());
            clubService.joinClub(clubId, userId);
            return Response.ok().build();
    }
}

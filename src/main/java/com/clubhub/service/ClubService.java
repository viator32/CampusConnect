package com.clubhub.service;

import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import com.clubhub.entity.Club;
import com.clubhub.repository.ClubRepository;

@ApplicationScoped
public class ClubService {

	@Inject
	ClubRepository clubRepository;

	public List<Club> getAllClubs() {
		return clubRepository.findAll();
	}

	public Club getClubById(UUID id) {
		return clubRepository.findById(id);
	}

	@Transactional
	public Club createClub(Club club) {
		clubRepository.save(club);
		return club;
	}

	@Transactional
	public Club updateClub(UUID id, Club updated) {
		Club existing = clubRepository.findById(id);
		if (existing == null) {
			return null;
		}
		existing.setName(updated.getName());
		existing.setDescription(updated.getDescription());
		existing.setLocation(updated.getLocation());

		return clubRepository.update(existing);
	}

	@Transactional
	public boolean deleteClub(UUID id) {
		Club existing = clubRepository.findById(id);
		if (existing == null) {
			return false;
		}
		clubRepository.delete(id);
		return true;
	}

}

package com.clubhub.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import com.clubhub.entity.Event;
import com.clubhub.entity.Member;
import com.clubhub.entity.User;
import com.clubhub.repository.EventRepository;

@ApplicationScoped
public class EventService {

    @Inject
    EventRepository eventRepository;

    @Inject
    UserService userService;

    @Transactional
    public void save(Event event) {
        eventRepository.save(event);
    }

    public List<Event> getFeedForUser(UUID userId) {
        User user = userService.getUserById(userId);
        List<Event> feed = new ArrayList<>();
        if (user == null) {
            return feed;
        }
        for (Member m : user.getMemberships()) {
            LocalDateTime joined = m.getJoinedAt();
            LocalDate joinedDate = joined != null ? joined.toLocalDate() : null;
            for (Event e : m.getClub().getEvents()) {
                if (joinedDate != null && e.getDate() != null
                        && !e.getDate().isBefore(joinedDate)) {
                    feed.add(e);
                }
            }
        }
        return feed;
    }
}


package com.clubhub.repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import com.clubhub.entity.Event;
import com.clubhub.entity.Member;
import com.clubhub.entity.User;
import com.clubhub.service.UserService;

@ApplicationScoped
public class EventService {

    @Inject
    EventRepository eventRepository;

    @Inject
    UserService userService;

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
            for (Event e : m.getClub().getEvents()) {
                if (joined != null && e.getDate() != null
                        && !e.getDate().atStartOfDay().isBefore(joined)) {
                    feed.add(e);
                }
            }
        }
        return feed;
    }
}


package com.clubhub.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.Comparator;

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
        if (event.getCreatedAt() == null) {
            event.setCreatedAt(LocalDateTime.now());
        }
        eventRepository.save(event);
    }

    public Event getEventById(UUID id) {
        return eventRepository.findById(id);
    }

    @Transactional
    public boolean joinEvent(UUID eventId, UUID userId) {
        Event event = eventRepository.findById(eventId);
        if (event == null) {
            return false;
        }
        User user = userService.getUserById(userId);
        if (user == null) {
            return false;
        }
        boolean isMember = event.getClub().getMembersList().stream()
                .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
        if (!isMember) {
            return false;
        }
        boolean alreadyJoined = event.getAttendees().stream()
                .anyMatch(u -> u.getId().equals(userId));
        if (!alreadyJoined) {
            event.getAttendees().add(user);
            eventRepository.update(event);
        }
        return true;
    }

    public List<Event> getFeedForUser(UUID userId, int page, int size) {
        User user = userService.getUserById(userId);
        List<Event> feed = new ArrayList<>();
        if (user == null) {
            return feed;
        }
        for (Member m : user.getMemberships()) {
            LocalDateTime joined = m.getJoinedAt();
            for (Event e : m.getClub().getEvents()) {
                LocalDateTime created = e.getCreatedAt();
                if (joined != null && created != null && !created.isBefore(joined)) {
                    feed.add(e);
                }
            }
        }
        return feed.stream()
                .sorted(Comparator.comparing(Event::getCreatedAt).reversed())
                .skip((long) page * size)
                .limit(size)
                .toList();
    }
}


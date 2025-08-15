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
import com.clubhub.exception.ClubHubErrorCode;
import com.clubhub.exception.ErrorPayload;
import com.clubhub.exception.NotFoundException;
import com.clubhub.exception.ValidationException;
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
        Event event = eventRepository.findById(id);
        if (event == null) {
            throw new NotFoundException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.EVENT_NOT_FOUND)
                    .title("Event not found")
                    .details("No event with id %s exists.".formatted(id))
                    .messageParameter("eventId", id.toString())
                    .sourcePointer("eventId")
                    .build());
        }
        return event;
    }

    @Transactional
    public void joinEvent(UUID eventId, UUID userId) {
        Event event = getEventById(eventId);
        User user = userService.getUserById(userId);
        boolean isMember = event.getClub().getMembersList().stream()
                .anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(userId));
        if (!isMember) {
            throw new ValidationException(ErrorPayload.builder()
                    .errorCode(ClubHubErrorCode.USER_NOT_MEMBER_OF_CLUB)
                    .title("User not a member")
                    .details("User must be a member of the club to join events.")
                    .messageParameter("eventId", eventId.toString())
                    .messageParameter("userId", userId.toString())
                    .build());
        }
        boolean alreadyJoined = event.getAttendees().stream()
                .anyMatch(u -> u.getId().equals(userId));
        if (!alreadyJoined) {
            event.getAttendees().add(user);
            eventRepository.update(event);
        }
    }

    public List<Event> getFeedForUser(UUID userId, int page, int size) {
        User user = userService.getUserById(userId);
        List<Event> feed = new ArrayList<>();
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


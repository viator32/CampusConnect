package com.clubhub.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = "club")
public class Event {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private UUID id;

        private String title;
        private String description;
        private LocalDate date;
        private String time;
        private LocalDateTime createdAt;

        @ManyToOne
        @JoinColumn(name = "club_id")
        private Club club;

        @ManyToMany
        @JoinTable(
                        name = "event_user",
                        joinColumns = @JoinColumn(name = "event_id"),
                        inverseJoinColumns = @JoinColumn(name = "user_id"))
        private Set<User> attendees = new HashSet<>();
}

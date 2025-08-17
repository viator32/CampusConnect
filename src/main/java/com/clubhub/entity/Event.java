package com.clubhub.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "event")
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

        @Column(name = "date")
        private LocalDate date;

        @Column(name = "time")
        private String time;

        @Column(name = "created_at")
        private LocalDateTime createdAt;

	@ManyToOne
	@JoinColumn(name = "club_id")
	private Club club;

	@ManyToMany
	@JoinTable(name = "event_user", joinColumns = @JoinColumn(name = "event_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
	private Set<User> attendees = new HashSet<>();
}

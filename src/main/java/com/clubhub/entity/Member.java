package com.clubhub.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = { "club", "user" })
public class Member {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private UUID id;

        @Enumerated(EnumType.STRING)
        private MemberRole role;
    private String avatar;

    private LocalDateTime joinedAt;

	@ManyToOne
	@JoinColumn(name = "club_id", nullable = false)
	private Club club;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;
}

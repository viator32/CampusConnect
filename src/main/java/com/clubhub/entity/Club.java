package com.clubhub.entity;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "clubs")
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = { "posts", "events", "membersList", "forumThreads" })
public class Club {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private UUID id;

	@Column(nullable = false)
	private String name;

	private String description;

        private String location;

        private String category;

        @Enumerated(EnumType.STRING)
        private Subject subject;

        @Enumerated(EnumType.STRING)
        private Preference interest;

    @Column(name = "avatar")
    private String avatar;

	@Column(name = "is_joined")
	private boolean isJoined;

	private int members;

	@OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<Event> events = new HashSet<>();

	@OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<Post> posts = new HashSet<>();

	@OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<Member> membersList = new HashSet<>();

	@OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<ForumThread> forumThreads = new HashSet<>();
}

package com.clubhub.entity;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = "memberships")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private UUID id;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = false)
	private String username;

	@Column(name = "password_hash", nullable = false)
	private String passwordHash;

	@Column(name = "avatar_bucket")
	private String avatarBucket;

	@Column(name = "avatar_object")
	private String avatarObject;

	@Column(name = "avatar_etag")
	private String avatarEtag;

	@Column(length = 1024)
	private String description;

	@ElementCollection(fetch = FetchType.EAGER, targetClass = Preference.class)
	@Enumerated(EnumType.STRING)
	@CollectionTable(name = "user_preferences", joinColumns = @JoinColumn(name = "user_id"))
	@Column(name = "preference")
	private Set<Preference> preferences = new HashSet<>();

	@Enumerated(EnumType.STRING)
	private Subject subject;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<Member> memberships = new HashSet<>();

}

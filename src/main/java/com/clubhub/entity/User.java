package com.clubhub.entity;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
@ToString(exclude = "joinedClubs")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private UUID id;

	@Column(nullable = false, unique = true)
	private String email; // z. B. max.mustermann@uni.de

	@Column(nullable = false)
	private String username; // z. B. MaxM

	@Column(nullable = false)
	private String passwordHash;

	@Column(nullable = true)
	private String studentId; // Optional: Matrikelnummer oder Ähnliches

	@ManyToMany
	@JoinTable(name = "user_club", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "club_id"))
	private List<Club> joinedClubs = new ArrayList<>();

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<Member> memberships = new HashSet<>();

}

package com.clubhub.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = { "club", "posts" })
public class ForumThread {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private UUID id;

	private String title;
	private String author;
	private int replies;
	private String lastActivity;
	private String content;

	@OneToMany(mappedBy = "thread", cascade = CascadeType.ALL)
	private List<Comment> posts = new ArrayList<>();

	@ManyToOne
	@JoinColumn(name = "club_id")
	private Club club;
}

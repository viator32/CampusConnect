package com.clubhub.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Embedded;
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
@ToString(exclude = { "club", "commentsList" })
public class Post {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private UUID id;

	private String author;
	private String content;
        private int likes;
        private int comments;
        private int bookmarks;
        private int shares;
        private LocalDateTime time;
        private String photo;

	@Embedded
	private Poll poll;

	@OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
	private List<Comment> commentsList = new ArrayList<>();

	@ManyToOne
	@JoinColumn(name = "club_id")
	private Club club;

}

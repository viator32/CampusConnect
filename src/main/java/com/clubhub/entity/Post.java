package com.clubhub.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "post")
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = { "club", "commentsList", "likedBy", "bookmarkedBy" })
public class Post {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private UUID id;

        @ManyToOne
        @JoinColumn(name = "author_id")
        private User author;
	private String content;
	private int likes;
	private int comments;
	private int bookmarks;
	private int shares;

	@Column(name = "time")
	private LocalDateTime time;

	private String photo;

	@Embedded
	private Poll poll;

	@OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
	private List<Comment> commentsList = new ArrayList<>();

	@ManyToMany
	@JoinTable(name = "post_likes", joinColumns = @JoinColumn(name = "post_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
	private Set<User> likedBy = new HashSet<>();

	@ManyToMany
	@JoinTable(name = "post_bookmarks", joinColumns = @JoinColumn(name = "post_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
	private Set<User> bookmarkedBy = new HashSet<>();

	@ManyToOne
	@JoinColumn(name = "club_id")
	private Club club;

}

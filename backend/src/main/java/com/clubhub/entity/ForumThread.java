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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "forumthread")
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = { "club", "replies", "upvotedBy", "downvotedBy" })
public class ForumThread {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private UUID id;

	private String title;

	@ManyToOne
	@JoinColumn(name = "author_id")
    private User author;
    @Column(name = "replies")
    private int replyCount;

	@Column(name = "last_activity")
	private String lastActivity;

	private String content;

    @OneToMany(mappedBy = "thread", cascade = CascadeType.ALL)
    private List<Reply> replies = new ArrayList<>();

	private int upvotes;

	private int downvotes;

	@ManyToMany
	@JoinTable(name = "thread_upvotes", joinColumns = @JoinColumn(name = "thread_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
	private Set<User> upvotedBy = new HashSet<>();

	@ManyToMany
	@JoinTable(name = "thread_downvotes", joinColumns = @JoinColumn(name = "thread_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
	private Set<User> downvotedBy = new HashSet<>();

	@ManyToOne
	@JoinColumn(name = "club_id")
	private Club club;
}

package com.clubhub.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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
@ToString(exclude = { "club", "posts" })
public class ForumThread {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private UUID id;

        private String title;

        @ManyToOne
        @JoinColumn(name = "author_id")
        private User author;
        private int replies;

        @Column(name = "last_activity")
        private String lastActivity;

        private String content;

	@OneToMany(mappedBy = "thread", cascade = CascadeType.ALL)
	private List<Comment> posts = new ArrayList<>();

	@ManyToOne
	@JoinColumn(name = "club_id")
	private Club club;
}

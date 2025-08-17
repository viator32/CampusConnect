package com.clubhub.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "comment")
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = { "post", "thread" })
public class Comment {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private UUID id;

	private String author;
        private String content;

        @Column(name = "time")
        private String time;

        private int likes;

	@ManyToOne
	@JoinColumn(name = "post_id")
	private Post post;

	@ManyToOne
	@JoinColumn(name = "thread_id")
	private ForumThread thread;

}

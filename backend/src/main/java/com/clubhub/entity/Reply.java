package com.clubhub.entity;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "reply")
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = {"thread", "upvotedBy", "downvotedBy", "author"})
public class Reply {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    private String content;

    @Column(name = "time")
    private String time;

    private int upvotes;

    private int downvotes;

    @ManyToMany
    @JoinTable(name = "reply_upvotes", joinColumns = @JoinColumn(name = "reply_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> upvotedBy = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "reply_downvotes", joinColumns = @JoinColumn(name = "reply_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> downvotedBy = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "thread_id")
    private ForumThread thread;
}

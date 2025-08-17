package com.clubhub.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
public class Poll {

        @Column(name = "poll_question")
        private String question;

        @ElementCollection
        @CollectionTable(name = "post_poll_options", joinColumns = @JoinColumn(name = "post_id"))
        private List<PollOption> options = new ArrayList<>();
}

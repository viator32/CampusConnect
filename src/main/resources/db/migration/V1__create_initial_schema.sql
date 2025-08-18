CREATE TABLE users
(
    id            UUID PRIMARY KEY,
    email         VARCHAR NOT NULL UNIQUE,
    username      VARCHAR NOT NULL,
    password_hash VARCHAR NOT NULL,
    student_id    VARCHAR
);

CREATE TABLE clubs
(
    id          UUID PRIMARY KEY,
    name        VARCHAR NOT NULL,
    description VARCHAR,
    location    VARCHAR,
    category    VARCHAR,
    image       VARCHAR,
    is_joined   BOOLEAN,
    members     INTEGER
);

CREATE TABLE member
(
    id        UUID PRIMARY KEY,
    role      VARCHAR,
    avatar    VARCHAR,
    joined_at TIMESTAMP,
    club_id   UUID NOT NULL REFERENCES clubs (id) ON DELETE CASCADE,
    user_id   UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE event
(
    id          UUID PRIMARY KEY,
    title       VARCHAR,
    description VARCHAR,
    date        DATE,
    time        VARCHAR,
    created_at  TIMESTAMP,
    club_id     UUID REFERENCES clubs (id) ON DELETE SET NULL
);

CREATE TABLE event_user
(
    event_id UUID NOT NULL REFERENCES event (id) ON DELETE CASCADE,
    user_id  UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, user_id)
);

CREATE TABLE forumthread
(
    id            UUID PRIMARY KEY,
    title         VARCHAR,
    author        VARCHAR,
    replies       INTEGER,
    last_activity VARCHAR,
    content       TEXT,
    club_id       UUID REFERENCES clubs (id) ON DELETE SET NULL
);

CREATE TABLE post
(
    id            UUID PRIMARY KEY,
    author        VARCHAR,
    content       TEXT,
    likes         INTEGER,
    comments      INTEGER,
    bookmarks     INTEGER,
    shares        INTEGER,
    time          TIMESTAMP,
    photo         VARCHAR,
    poll_question VARCHAR,
    club_id       UUID REFERENCES clubs (id) ON DELETE SET NULL
);

CREATE TABLE post_poll_options
(
    post_id     UUID NOT NULL REFERENCES post (id) ON DELETE CASCADE,
    option_text VARCHAR,
    votes       INTEGER,
    PRIMARY KEY (post_id, option_text)
);

CREATE TABLE post_likes
(
    post_id UUID NOT NULL REFERENCES post (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE comment
(
    id        UUID PRIMARY KEY,
    author    VARCHAR,
    content   TEXT,
    time      VARCHAR,
    likes     INTEGER,
    post_id   UUID REFERENCES post (id) ON DELETE CASCADE,
    thread_id UUID REFERENCES forumthread (id) ON DELETE CASCADE
);

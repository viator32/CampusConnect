CREATE TABLE users (
    id            UUID PRIMARY KEY,
    email         VARCHAR NOT NULL UNIQUE,
    username      VARCHAR NOT NULL,
    password_hash VARCHAR NOT NULL,
    avatar_bucket TEXT,
    avatar_object TEXT,
    avatar_etag   TEXT,
    description   VARCHAR(1024),
    subject       VARCHAR
);

CREATE TABLE clubs (
    id          UUID PRIMARY KEY,
    name        VARCHAR NOT NULL,
    description VARCHAR,
    location    VARCHAR,
    category    VARCHAR,
    subject     VARCHAR,
    interest    VARCHAR,
    is_joined   BOOLEAN,
    members     INTEGER,
    avatar_bucket TEXT,
    avatar_object TEXT,
    avatar_etag   TEXT
);

CREATE TABLE member (
    id        UUID PRIMARY KEY,
    role      VARCHAR,
    joined_at TIMESTAMP,
    club_id   UUID NOT NULL REFERENCES clubs (id) ON DELETE CASCADE,
    user_id   UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE event (
    id          UUID PRIMARY KEY,
    title       VARCHAR,
    description VARCHAR,
    date        DATE,
    time        VARCHAR,
    status      VARCHAR DEFAULT 'SCHEDULED',
    location    VARCHAR,
    created_at  TIMESTAMP,
    club_id     UUID REFERENCES clubs (id) ON DELETE SET NULL
);

CREATE TABLE event_user (
    event_id UUID NOT NULL REFERENCES event (id) ON DELETE CASCADE,
    user_id  UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, user_id)
);

CREATE TABLE forumthread (
    id            UUID PRIMARY KEY,
    title         VARCHAR,
    author_id     UUID REFERENCES users (id) ON DELETE SET NULL,
    replies       INTEGER,
    last_activity VARCHAR,
    content       TEXT,
    club_id       UUID REFERENCES clubs (id) ON DELETE SET NULL,
    upvotes       INTEGER,
    downvotes     INTEGER
);

CREATE TABLE thread_upvotes (
    thread_id UUID NOT NULL REFERENCES forumthread (id) ON DELETE CASCADE,
    user_id   UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE thread_downvotes (
    thread_id UUID NOT NULL REFERENCES forumthread (id) ON DELETE CASCADE,
    user_id   UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE post (
    id            UUID PRIMARY KEY,
    author_id     UUID REFERENCES users (id) ON DELETE SET NULL,
    content       TEXT,
    likes         INTEGER,
    comments      INTEGER,
    bookmarks     INTEGER,
    shares        INTEGER,
    time          TIMESTAMP,
    picture_bucket TEXT,
    picture_object TEXT,
    picture_etag   TEXT,
    poll_question  VARCHAR,
    club_id        UUID REFERENCES clubs (id) ON DELETE SET NULL
);

CREATE TABLE post_poll_options (
    post_id     UUID NOT NULL REFERENCES post (id) ON DELETE CASCADE,
    option_text VARCHAR,
    votes       INTEGER,
    PRIMARY KEY (post_id, option_text)
);

CREATE TABLE post_likes (
    post_id UUID NOT NULL REFERENCES post (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE post_bookmarks (
    post_id UUID NOT NULL REFERENCES post (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE comment (
    id        UUID PRIMARY KEY,
    author_id    UUID REFERENCES users (id) ON DELETE SET NULL,
    content   TEXT,
    time      VARCHAR,
    likes     INTEGER,
    post_id   UUID REFERENCES post (id) ON DELETE CASCADE
);

CREATE TABLE comment_likes (
    comment_id UUID NOT NULL REFERENCES comment (id) ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (comment_id, user_id)
);

CREATE TABLE user_preferences (
    user_id     UUID NOT NULL,
    preference  VARCHAR NOT NULL,
    CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE reply (
    id        UUID PRIMARY KEY,
    author_id UUID REFERENCES users (id) ON DELETE SET NULL,
    content   TEXT,
    time      VARCHAR,
    upvotes   INTEGER,
    downvotes INTEGER,
    thread_id UUID REFERENCES forumthread (id) ON DELETE CASCADE
);

CREATE TABLE reply_upvotes (
    reply_id UUID NOT NULL REFERENCES reply (id) ON DELETE CASCADE,
    user_id  UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (reply_id, user_id)
);

CREATE TABLE reply_downvotes (
    reply_id UUID NOT NULL REFERENCES reply (id) ON DELETE CASCADE,
    user_id  UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (reply_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_post_time ON post ("time");
CREATE INDEX IF NOT EXISTS idx_member_club_user ON member (club_id, user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_user ON post_likes (post_id, user_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_user ON comment_likes (comment_id, user_id);
CREATE INDEX IF NOT EXISTS idx_thread_upvotes_thread_user ON thread_upvotes (thread_id, user_id);
CREATE INDEX IF NOT EXISTS idx_thread_downvotes_thread_user ON thread_downvotes (thread_id, user_id);
CREATE INDEX IF NOT EXISTS idx_reply_upvotes_reply_user ON reply_upvotes (reply_id, user_id);
CREATE INDEX IF NOT EXISTS idx_reply_downvotes_reply_user ON reply_downvotes (reply_id, user_id);


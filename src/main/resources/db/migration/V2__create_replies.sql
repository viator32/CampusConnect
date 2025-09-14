-- Create table for thread replies with upvote/downvote tracking
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

ALTER TABLE comment DROP COLUMN thread_id;

CREATE INDEX IF NOT EXISTS idx_reply_upvotes_reply_user ON reply_upvotes (reply_id, user_id);
CREATE INDEX IF NOT EXISTS idx_reply_downvotes_reply_user ON reply_downvotes (reply_id, user_id);

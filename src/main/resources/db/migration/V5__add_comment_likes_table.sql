CREATE TABLE comment_likes (
    comment_id UUID NOT NULL REFERENCES comment (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    PRIMARY KEY (comment_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_user ON comment_likes (comment_id, user_id);

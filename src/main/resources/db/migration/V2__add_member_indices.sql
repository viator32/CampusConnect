CREATE INDEX IF NOT EXISTS idx_member_club_user ON member (club_id, user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_user ON post_likes (post_id, user_id);

ALTER TABLE users
DROP COLUMN preference;

CREATE TABLE user_preferences (
    user_id UUID NOT NULL,
    preference VARCHAR NOT NULL,
    CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) REFERENCES users(id)
);

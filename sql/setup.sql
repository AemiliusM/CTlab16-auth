DROP TABLE IF EXISTS user CASCADE;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);

INSERT INTO users (id, email, password_hash) VALUES (1, 'blick@blorck.com', 'password')
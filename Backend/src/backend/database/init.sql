CREATE DATABASE "bookUp_db";

CREATE TABLE IF NOT EXISTS book (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    author TEXT,
    description TEXT,
    review TEXT,
    format VARCHAR(20),
    keywords TEXT,
    creator TEXT,
    producer TEXT,
    subject TEXT,
    encryption VARCHAR(50),
    creation_date TEXT,
    mod_date TEXT,
    path_book TEXT
);

CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
	  username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS category (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    UNIQUE(user_id, name)
);

CREATE TABLE IF NOT EXISTS book_category (
    book_id INTEGER NOT NULL REFERENCES book(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, category_id)
);

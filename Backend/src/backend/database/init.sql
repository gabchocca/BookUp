CREATE DATABASE "bookUp_db";

CREATE TABLE IF NOT EXISTS book (
    id SERIAL PRIMARY KEY,
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
    mod_date TEXT
);

CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
	  username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

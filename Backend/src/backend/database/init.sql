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

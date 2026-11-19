import os
import psycopg

def get_db():
    with psycopg.connect(os.environ["DATABASE_URL"]) as conn:
        yield conn


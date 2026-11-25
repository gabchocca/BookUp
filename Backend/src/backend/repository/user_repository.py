from ..schemas.user import User 
import psycopg
from psycopg.rows import dict_row

class UserRepository:
    def register_user(self, conn : psycopg.Connection, user : User):
        with conn.transaction():
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    "INSERT INTO users (username, email, password, name) VALUES (%s, %s, %s, %s) RETURNING id, email",
                    (user.username, user.email, user.password, user.name)
                )
                result = cur.fetchone()
                return result

    def get_user_by_identifier(self, conn : psycopg.Connection, identifier : str):
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(
                "SELECT id, username, email, password, is_active FROM users WHERE email = %s OR username = %s",
                (identifier, identifier)
            )
            result = cur.fetchone()
            return result

    def get_user_by_id(self, conn: psycopg.Connection, user_id: int):
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(
                "SELECT id, username, email, name, is_active FROM users WHERE id = %s",
                (user_id,)
            )
            return cur.fetchone()

    def update_user(
        self, 
        conn: psycopg.Connection, 
        user_id: int, 
        name: str | None, 
        username: str | None, 
        email: str | None, 
        hashed_password: str | None
    ):
        with conn.transaction():
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                    UPDATE users
                    SET name = COALESCE(%s, name),
                        username = COALESCE(%s, username),
                        email = COALESCE(%s, email),
                        password = COALESCE(%s, password)
                    WHERE id = %s
                    RETURNING id, username, email, name, is_active
                """, (name, username, email, hashed_password, user_id))
                return cur.fetchone()

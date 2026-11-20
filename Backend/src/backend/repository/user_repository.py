from ..schemas.user import User 
import psycopg
from psycopg.rows import dict_row

class UserRepository:
    def register_user(self, conn : psycopg.Connection, user : User):
        with conn.transaction():
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    "INSERT INTO users (username, email, password) VALUES (%s, %s, %s) RETURNING id, email",
                    (user.username, user.email, user.password)
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

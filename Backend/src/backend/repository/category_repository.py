
from ..schemas.user import User 
import psycopg
from psycopg.rows import dict_row

class CategoryRepository:

    def create_category(self, conn: psycopg.Connection, name: str, user_id: int):
        with conn.transaction():
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    """
                    INSERT INTO category (name, user_id)
                    VALUES (%s, %s)
                    RETURNING id, name, user_id
                    """,
                    (name, user_id)
                )
                return cur.fetchone()

    def get_categories_by_user(self, conn: psycopg.Connection, user_id: int):
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(
                """
                SELECT c.id, c.name, c.user_id, COUNT(bc.book_id) AS book_count
                FROM category c
                LEFT JOIN book_category bc ON c.id = bc.category_id
                WHERE c.user_id = %s
                GROUP BY c.id, c.name, c.user_id
                ORDER BY c.name ASC
                """,
                (user_id,)
            )
            return cur.fetchall()

    def get_category_by_id_and_user(self, conn: psycopg.Connection, category_id: int, user_id: int):
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(
                "SELECT id, name, user_id FROM category WHERE id = %s AND user_id = %s",
                (category_id, user_id)
            )
            return cur.fetchone()

    def delete_category(self, conn: psycopg.Connection, category_id: int, user_id: int) -> bool:
        with conn.transaction():
            with conn.cursor() as cur:
                cur.execute(
                    "DELETE FROM category WHERE id = %s AND user_id = %s RETURNING id",
                    (category_id, user_id)
                )
                return cur.fetchone() is not None

    def get_books_by_category(self, conn: psycopg.Connection, category_id: int):
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(
                """
                SELECT 
                    b.id,
                    b.user_id,
                    b.path_book AS path,
                    b.title,
                    b.author,
                    b.description,
                    b.review,
                    b.format,
                    b.keywords,
                    b.creator,
                    b.producer,
                    b.subject,
                    b.encryption,
                    b.creation_date,
                    b.mod_date
                FROM book b
                INNER JOIN book_category bc ON b.id = bc.book_id
                WHERE bc.category_id = %s
                ORDER BY b.title ASC NULLS LAST
                """,
                (category_id,)
            )
            return cur.fetchall()

    def check_book_exists_and_belongs_to_user(self, conn: psycopg.Connection, book_id: int, user_id: int) -> bool:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT 1 FROM book WHERE id = %s AND user_id = %s",
                (book_id, user_id)
            )
            return cur.fetchone() is not None

    def add_book_to_category(self, conn: psycopg.Connection, category_id: int, book_id: int):
        with conn.transaction():
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO book_category (category_id, book_id)
                    VALUES (%s, %s)
                    ON CONFLICT (book_id, category_id) DO NOTHING
                    """,
                    (category_id, book_id)
                )

    def remove_book_from_category(self, conn: psycopg.Connection, category_id: int, book_id: int) -> bool:
        with conn.transaction():
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM book_category
                    WHERE category_id = %s AND book_id = %s
                    RETURNING book_id
                    """,
                    (category_id, book_id)
                )
                return cur.fetchone() is not None

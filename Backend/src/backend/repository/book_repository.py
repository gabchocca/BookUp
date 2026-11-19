from ..schemas.book import Book, BookUpdate
import psycopg
from psycopg.rows import dict_row

class BookRepository:

    def uploadBook(self, conn: psycopg.Connection, book: Book):
        with conn.transaction():
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                INSERT INTO book 
                (title, author, description, review, format, keywords, creator, producer, subject, encryption, creation_date, mod_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
                            """,
                            (book.title, book.author, book.description, book.review, book.format,
                             book.keywords, book.creator, book.producer, book.subject, book.encryption, book.creation_date, book.mod_date)
                            )
                result = cur.fetchone()
                return result

    def getDataBook(self, conn: psycopg.Connection, book_id: int):
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute("SELECT * FROM book WHERE id = %s", (book_id,))
            return cur.fetchone()

    def updateBook(self, conn: psycopg.Connection, book_id: int, newBook : BookUpdate):
        with conn.transaction():
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("""
                            UPDATE book SET title = COALESCE(%s, title), description = COALESCE(%s, description), review = COALESCE(%s, review) WHERE id = %s
                            RETURNING id, title, description, review
                            """, 
                            (newBook.title,newBook.description , newBook.review, book_id))
                result = cur.fetchone()
                return result

    def deleteBook(self, conn: psycopg.Connection, book_id: int):
        with conn.transaction():
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("DELETE FROM book WHERE id = %s RETURNING *", (book_id,))

                result = cur.fetchone()
                return result

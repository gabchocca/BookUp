
from ..schemas.book import Book, BookUpdate
from ..repository.book_repository import BookRepository
import psycopg
import pymupdf
from .. import exceptions as exc

class BookService:
    def __init__(self):
            self.repo = BookRepository()

    def uploadBook(self, conn: psycopg.Connection, path : str):
        try:
            path = path.strip('"').strip("'")
            with pymupdf.open(path) as doc:
                metadata = doc.metadata or {}
        except Exception as e:
            raise exc.InvalidBookFileError() 

        book = Book.model_validate({**metadata, "path": path})
        return self.repo.uploadBook(conn, book)

    def getDataBook(self, conn: psycopg.Connection, book_id : int):
        book = self.repo.getDataBook(conn, book_id)
        if not book:
            raise exc.BookNotFoundError(book_id)

        return book 

    def updateBook(self, conn: psycopg.Connection, book_id: int, newBook : BookUpdate):
        if not newBook.model_dump(exclude_none=True):
            raise exc.EmptyUpdateError()

        updatedBook = self.repo.updateBook(conn, book_id, newBook)
        if not updatedBook:
            raise exc.BookNotFoundError(book_id)

        return updatedBook

    def deleteBook(self, conn: psycopg.Connection, book_id: int):
        deletedBook = self.repo.deleteBook(conn, book_id)
        if not deletedBook:
            raise exc.BookNotFoundError(book_id)

        return deletedBook

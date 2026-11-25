
from ..schemas.book import Book, BookUpdate
from ..repository.book_repository import BookRepository
import psycopg
import pymupdf
from .. import exceptions as exc
import os
from pathlib import Path
import string

class BookService:
    def __init__(self):
        self.repo = BookRepository()

    def uploadBook(self, conn: psycopg.Connection, path: str, user_id: int, book_data: BookUpdate):
        try:
            path = path.strip('"').strip("'")
            with pymupdf.open(path) as doc:
                metadata = doc.metadata or {}
        except Exception:
            raise exc.InvalidBookFileError() 

        final_title = (book_data.title or "").strip() or metadata.get("title")
        final_author = (book_data.author or "").strip() or metadata.get("author")

        book = Book.model_validate({
            **metadata,
            "title": final_title,
            "author": final_author,
            "description": book_data.description,
            "review": book_data.review,
            "path": path
        })
        return self.repo.uploadBook(conn, book, user_id)

    def getBooksByUser(self, conn: psycopg.Connection, user_id: int):
        return self.repo.getBooksByUser(conn, user_id)

    def getDataBook(self, conn: psycopg.Connection, book_id: int):
        book = self.repo.getDataBook(conn, book_id)
        if not book:
            raise exc.BookNotFoundError(book_id)

        return book 

    def getBookCover(self, conn: psycopg.Connection, book_id: int) -> bytes:
        book = self.getDataBook(conn, book_id)
        path = book.get("path_book")  

        if not path:
            raise exc.InvalidBookFileError()

        try:
            with pymupdf.open(path) as doc:
                if len(doc) == 0:
                    raise exc.InvalidBookFileError()

                pix = doc.get_page_pixmap(0, dpi=100)
                return pix.tobytes("png")
        except exc.InvalidBookFileError:
            raise
        except Exception:
            raise exc.InvalidBookFileError()

    def updateBook(self, conn: psycopg.Connection, book_id: int, user_id: int, newBook: BookUpdate):
        if not newBook.model_dump(exclude_none=True):
            raise exc.EmptyUpdateError()

        updatedBook = self.repo.updateBook(conn, book_id, user_id, newBook)
        if not updatedBook:
            raise exc.BookNotFoundError(book_id)

        return updatedBook

    def deleteBook(self, conn: psycopg.Connection, book_id: int, user_id: int):
        deletedBook = self.repo.deleteBook(conn, book_id, user_id)
        if not deletedBook:
            raise exc.BookNotFoundError(book_id)

        return deletedBook

    def listDirectory(self, folder_path: str | None = None) -> dict:
        if not folder_path:
            drives = [f"{d}:\\" for d in string.ascii_uppercase if os.path.exists(f"{d}:\\")]
            return {
                "current_path": "",
                "parent_path": None,
                "folders": drives,
                "files": []
            }

        target = Path(folder_path)
        if not target.exists() or not target.is_dir():
            raise exc.InvalidBookFileError()

        folders = []
        files = []

        for item in sorted(target.iterdir(), key=lambda x: x.name.lower()):
            try:
                if item.is_dir() and not item.name.startswith("."):
                    folders.append(item.name)
                elif item.is_file() and item.suffix.lower() == ".pdf":
                    files.append(item.name)
            except PermissionError:
                continue 

        parent = str(target.parent) if target.parent != target else ""

        return {
            "current_path": str(target),
            "parent_path": parent,
            "folders": folders,
            "files": files
        }

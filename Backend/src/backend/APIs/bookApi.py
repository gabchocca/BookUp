from fastapi import APIRouter, Depends, status
import psycopg
from ..services.book_service import BookService
from ..database.database import get_db
from ..schemas.book import Book, BookUpdate

routerBook = APIRouter(prefix='/book', tags=['book'])

service = BookService()

@routerBook.post("/", status_code=status.HTTP_201_CREATED)
def uploadBook(path: str, conn: psycopg.Connection = Depends(get_db)):
    return service.uploadBook(conn, path)

@routerBook.get("/{book_id}")
def getDataBook(book_id : int, conn: psycopg.Connection = Depends(get_db)):
    return service.getDataBook(conn, book_id )

@routerBook.patch("/{book_id}")
def updateBook(book_id : int, newBook : BookUpdate, conn: psycopg.Connection = Depends(get_db)):
    return service.updateBook(conn, book_id, newBook)

@routerBook.delete("/{book_id}")
def deleteBook(book_id : int, conn: psycopg.Connection = Depends(get_db)):
    return service.deleteBook(conn, book_id)

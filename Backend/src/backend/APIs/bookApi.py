from fastapi import APIRouter, Depends, status, Response
import psycopg
from ..services.book_service import BookService
from ..database.database import get_db
from ..schemas.book import Book, BookUpdate
from ..core.security import get_current_user

routerBook = APIRouter(prefix='/book', tags=['book'])

service = BookService()

@routerBook.post("/", status_code=status.HTTP_201_CREATED)
def uploadBook(
    path: str, 
    book_data: BookUpdate,
    conn: psycopg.Connection = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    return service.uploadBook(conn, path, int(user_id), book_data)

@routerBook.get("/my-books")
def getMyBooks(
    conn: psycopg.Connection = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    return service.getBooksByUser(conn, int(user_id))

@routerBook.get("/browse")
def browseFiles(folder: str | None = None):
    return service.listDirectory(folder)

@routerBook.get("/{book_id}")
def getDataBook(book_id: int, conn: psycopg.Connection = Depends(get_db)):
    return service.getDataBook(conn, book_id)

@routerBook.get("/{book_id}/cover")
def getBookCover(book_id: int, conn: psycopg.Connection = Depends(get_db)):
    img_bytes = service.getBookCover(conn, book_id)
    return Response(
        content=img_bytes,
        media_type="image/png",
        headers={
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
        }
    )


@routerBook.patch("/{book_id}")
def updateBook(
    book_id: int, 
    newBook: BookUpdate, 
    conn: psycopg.Connection = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    return service.updateBook(conn, book_id, int(user_id), newBook)

@routerBook.delete("/{book_id}")
def deleteBook(
    book_id: int, 
    conn: psycopg.Connection = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    return service.deleteBook(conn, book_id, int(user_id))

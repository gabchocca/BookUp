from fastapi import APIRouter, Depends, status
import psycopg

from ..schemas.category import CategoryCreate, CategoryResponse, BookInCategoryResponse
from ..services.category_service import CategoryService
from ..database.database import get_db
from ..core.security import get_current_user

routerCategory = APIRouter(prefix="/category", tags=["Categories"])
service = CategoryService()


@routerCategory.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category: CategoryCreate,
    conn: psycopg.Connection = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    return service.create_category(conn, category, int(user_id))


@routerCategory.get("/my-categories", response_model=list[CategoryResponse])
def get_my_categories(
    conn: psycopg.Connection = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    return service.get_my_categories(conn, int(user_id))


@routerCategory.delete("/{category_id}")
def delete_category(
    category_id: int,
    conn: psycopg.Connection = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    return service.delete_category(conn, category_id, int(user_id))


@routerCategory.get("/{category_id}/books", response_model=list[BookInCategoryResponse])
def get_books_by_category(
    category_id: int,
    conn: psycopg.Connection = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    return service.get_books_by_category(conn, category_id, int(user_id))


@routerCategory.post("/{category_id}/books/{book_id}", status_code=status.HTTP_201_CREATED)
def add_book_to_category(
    category_id: int,
    book_id: int,
    conn: psycopg.Connection = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    return service.add_book_to_category(conn, category_id, book_id, int(user_id))


@routerCategory.delete("/{category_id}/books/{book_id}")
def remove_book_from_category(
    category_id: int,
    book_id: int,
    conn: psycopg.Connection = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    return service.remove_book_from_category(conn, category_id, book_id, int(user_id))

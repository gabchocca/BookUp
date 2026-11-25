import psycopg
from psycopg.errors import UniqueViolation
from ..repository.category_repository import CategoryRepository
from ..schemas.category import CategoryCreate
from fastapi import HTTPException, status
from ..exceptions import (
    BookNotFoundError,
    CategoryNotFoundError,
    CategoryAlreadyExistsError,
    EmptyCategoryNameError,
    CategoryNameTooLongError,
    BookNotInCategoryError,
)


class CategoryService:
    def __init__(self):
        self.repository = CategoryRepository()

    def create_category(self, conn: psycopg.Connection, category: CategoryCreate, user_id: int):
        clean_name = category.name.strip()
        if not clean_name:
            raise EmptyCategoryNameError()
        if len(clean_name) > 100:
            raise CategoryNameTooLongError(100)

        try:
            new_category = self.repository.create_category(conn, clean_name, user_id)
            if not new_category:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="No se pudo crear la categoría."
                )
            new_category["book_count"] = 0
            return new_category
        except UniqueViolation:
            raise CategoryAlreadyExistsError(clean_name)

    def get_my_categories(self, conn: psycopg.Connection, user_id: int):
        return self.repository.get_categories_by_user(conn, user_id)

    def delete_category(self, conn: psycopg.Connection, category_id: int, user_id: int):
        deleted = self.repository.delete_category(conn, category_id, user_id)
        if not deleted:
            raise CategoryNotFoundError(category_id)
        return {"message": "Categoría eliminada correctamente."}

    def get_books_by_category(self, conn: psycopg.Connection, category_id: int, user_id: int):
        category = self.repository.get_category_by_id_and_user(conn, category_id, user_id)
        if not category:
            raise CategoryNotFoundError(category_id)
        return self.repository.get_books_by_category(conn, category_id)

    def add_book_to_category(self, conn: psycopg.Connection, category_id: int, book_id: int, user_id: int):
        category = self.repository.get_category_by_id_and_user(conn, category_id, user_id)
        if not category:
            raise CategoryNotFoundError(category_id)

        if not self.repository.check_book_exists_and_belongs_to_user(conn, book_id, user_id):
            raise BookNotFoundError(book_id)

        self.repository.add_book_to_category(conn, category_id, book_id)
        return {"message": "Libro añadido a la categoría."}

    def remove_book_from_category(self, conn: psycopg.Connection, category_id: int, book_id: int, user_id: int):
        category = self.repository.get_category_by_id_and_user(conn, category_id, user_id)
        if not category:
            raise CategoryNotFoundError(category_id)

        removed = self.repository.remove_book_from_category(conn, category_id, book_id)
        if not removed:
            raise BookNotInCategoryError(book_id, category_id)
        return {"message": "Libro quitado de la categoría."}

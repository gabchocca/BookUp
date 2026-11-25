from fastapi import HTTPException, status


class BookNotFoundError(HTTPException):
    def __init__(self, book_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Libro con id {book_id} no encontrado"
        )


class CategoryNotFoundError(HTTPException):
    def __init__(self, category_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoría con id {category_id} no encontrada"
        )


class CategoryAlreadyExistsError(HTTPException):
    def __init__(self, name: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya tienes una categoría llamada '{name}'"
        )


class EmptyCategoryNameError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre de la categoría no puede estar vacío"
        )


class CategoryNameTooLongError(HTTPException):
    def __init__(self, max_length: int = 100):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El nombre de la categoría no puede superar los {max_length} caracteres"
        )


class BookNotInCategoryError(HTTPException):
    def __init__(self, book_id: int, category_id: int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"El libro con id {book_id} no está asignado a la categoría {category_id}"
        )
class InvalidBookFileError(Exception):
    pass

class EmptyUpdateError(Exception):
    pass

class UserAlreadyExistsError(Exception):
    def __init__(self, identifier: str):
        self.identifier = identifier
        super().__init__(f"El usuario o correo '{identifier}' ya está registrado")

class InvalidCredentialsError(Exception):
    def __init__(self):
        super().__init__("Credenciales incorrectas")

class InactiveUserError(Exception):
    def __init__(self):
        super().__init__("La cuenta de usuario está inactiva")


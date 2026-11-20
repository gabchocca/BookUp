
class BookNotFoundError(Exception):
    def __init__(self, book_id: int):
        self.book_id = book_id
        super().__init__(f"Libro con id {book_id} no encontrado")

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

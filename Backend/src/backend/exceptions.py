
class BookNotFoundError(Exception):
    def __init__(self, book_id: int):
        self.book_id = book_id
        super().__init__(f"Libro con id {book_id} no encontrado")

class InvalidBookFileError(Exception):
    pass

class EmptyUpdateError(Exception):
    pass

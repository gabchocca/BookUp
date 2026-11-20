from fastapi import HTTPException
import psycopg
from ..schemas.user import User
from ..repository.user_repository import UserRepository
from ..core.security import hash_password, verify_password, create_access_token
from ..exceptions import *

class UserService():
    def __init__(self):
            self.user_repo = UserRepository()

    def register_user(self, conn: psycopg.Connection, user: User):
        user.password = hash_password(user.password)
        try:
            return self.user_repo.register_user(conn, user)
        except psycopg.errors.UniqueViolation:
            raise UserAlreadyExistsError(user.email)

    def authenticate_user(self, conn: psycopg.Connection, identifier: str, password: str) -> dict:
        db_user = self.user_repo.get_user_by_identifier(conn, identifier)

        if not db_user or not verify_password(password, db_user["password"]):
            raise InvalidCredentialsError()

        if not db_user["is_active"]:
            raise InactiveUserError()

        return create_access_token(db_user["id"])

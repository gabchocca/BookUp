from fastapi import HTTPException
import psycopg
from ..schemas.user import User, UserUpdate
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

    def get_profile(self, conn: psycopg.Connection, user_id: int):
        user = self.user_repo.get_user_by_id(conn, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        return user

    def update_profile(self, conn: psycopg.Connection, user_id: int, data: UserUpdate):
        name = data.name.strip() if data.name and data.name.strip() else None
        username = data.username.strip() if data.username and data.username.strip() else None
        email = data.email.strip() if data.email and data.email.strip() else None
        
        hashed_pw = hash_password(data.password) if data.password and data.password.strip() else None

        try:
            updated = self.user_repo.update_user(conn, user_id, name, username, email, hashed_pw)
            if not updated:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")
            return updated
        except psycopg.errors.UniqueViolation:
            # Si intenta ponerse un username o email que ya usa otra cuenta
            raise HTTPException(status_code=400, detail="El usuario o correo ya está en uso")

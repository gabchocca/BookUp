from fastapi import APIRouter, Depends, status
import psycopg
from ..services.user_service import UserService
from ..database.database import get_db
from ..schemas.user import User, LoginRequest, UserUpdate
from ..core.security import *

routerUser = APIRouter(prefix='/user', tags=['user'])

service = UserService()

@routerUser.post("/register")
def register(user: User, conn = Depends(get_db)):
    
    return service.register_user(conn, user)

@routerUser.post("/login")
def login(credentials: LoginRequest, conn: psycopg.Connection = Depends(get_db)):
    return service.authenticate_user(conn, credentials.identifier, credentials.password)

@routerUser.get("/me")
def get_my_profile(
    conn: psycopg.Connection = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    return service.get_profile(conn, int(user_id))

@routerUser.patch("/me")
def update_my_profile(
    data: UserUpdate,
    conn: psycopg.Connection = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    return service.update_profile(conn, int(user_id), data)

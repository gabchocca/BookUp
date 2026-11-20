from fastapi import APIRouter, Depends, status
import psycopg
from ..services.user_service import UserService
from ..database.database import get_db
from ..schemas.user import User 
from ..schemas.user import LoginRequest
from ..core.security import *

routerUser = APIRouter(prefix='/user', tags=['user'])

service = UserService()

@routerUser.post("/")
def register(user: User, conn = Depends(get_db)):
    
    return service.register_user(conn, user)

@routerUser.post("/login")
def login(credentials: LoginRequest, conn: psycopg.Connection = Depends(get_db)):
    return service.authenticate_user(conn, credentials.identifier, credentials.password)

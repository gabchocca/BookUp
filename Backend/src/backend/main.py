from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware

from .APIs.bookApi import routerBook
from .APIs.userApi import routerUser
import psycopg
import os

from backend.exceptions import *
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from fastapi.security import OAuth2PasswordBearer
import jwt

app = FastAPI()

#CORS configuration
origins = [
    "http://localhost:5000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Router configuration
app.include_router(routerBook)
app.include_router(routerUser)


@app.exception_handler(BookNotFoundError)
async def book_not_found_handler(request: Request, exc: BookNotFoundError):
    return JSONResponse(
        status_code=404,
        content={"detail": str(exc)},
    )

@app.exception_handler(InvalidBookFileError)
async def invalid_file_handler(request: Request, exc: InvalidBookFileError):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc)},
    )

@app.exception_handler(EmptyUpdateError)
async def empty_update_handler(request: Request, error: EmptyUpdateError):
    return JSONResponse(
        status_code=400,
        content={"detail": str(error)},
    )

@app.exception_handler(UserAlreadyExistsError)
async def user_already_exists_handler(request: Request, exc: UserAlreadyExistsError):
    return JSONResponse(status_code=400, content={"detail": str(exc)})

@app.exception_handler(InvalidCredentialsError)
async def invalid_credentials_handler(request: Request, exc: InvalidCredentialsError):
    return JSONResponse(status_code=401, content={"detail": str(exc)})

@app.exception_handler(InactiveUserError)
async def inactive_user_handler(request: Request, exc: InactiveUserError):
    return JSONResponse(status_code=403, content={"detail": str(exc)})

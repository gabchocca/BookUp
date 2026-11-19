from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware

from .APIs.bookApi import routerBook
import psycopg
import os

from backend.exceptions import *
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

#Cors configuration
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
app.include_router(routerBook)

# @app.get("/")
# async def main():
#     return {"message": "Hello World"}
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

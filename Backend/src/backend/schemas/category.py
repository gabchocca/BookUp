from pydantic import BaseModel
from datetime import datetime

class CategoryCreate(BaseModel):
    name: str


class CategoryResponse(BaseModel):
    id: int
    name: str
    user_id: int
    book_count: int = 0


class BookInCategoryResponse(BaseModel):
    id: int
    user_id: int
    path: str
    description: str | None = None
    review: str | None = None
    producer: str | None = None
    format: str | None = None
    encryption: str | None = None
    author: str | None = None
    mod_date: str | None = None
    keywords: str | None = None
    title: str | None = None
    creation_date: str | None = None
    creator: str | None = None
    subject: str | None = None

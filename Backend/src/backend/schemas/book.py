from datetime import datetime
from pydantic import BaseModel, Field, field_validator
import pymupdf

class Book(BaseModel):
    path: str
    description: str | None = None  
    review: str | None = None       
    producer: str | None = None
    format: str | None = None
    encryption: str | None = None
    author: str | None = None
    mod_date: datetime | None = Field(default=None, alias="modDate")
    keywords: str | None = None
    title: str | None = None
    creation_date: datetime | None = Field(default=None, alias="creationDate")
    creator: str | None = None
    subject: str | None = None

    @field_validator("*", mode="before")
    @classmethod
    def clean_empty(cls, value):
        return None if value == "" else value

    @field_validator("creation_date", "mod_date", mode="before")
    @classmethod
    def parse_pdf_date(cls, value):
        if not isinstance(value, str):
            return value
        clean = value.removeprefix("D:").replace("'", "")
        for fmt in ("%Y%m%d%H%M%S%z", "%Y%m%d%H%M%S", "%Y%m%d"):
            try:
                return datetime.strptime(clean, fmt)
            except ValueError:
                continue
        return None   

class BookUpdate(BaseModel):
    title: str | None = None
    author: str | None = None
    description: str | None = None
    review: str | None = None

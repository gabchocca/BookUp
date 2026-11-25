
from pydantic import BaseModel,  EmailStr

class User (BaseModel):
    username : str
    email : str
    password : str
    name : str
    isActive : bool = True

class LoginRequest(BaseModel):
    identifier: str
    password: str

class UserUpdate(BaseModel):
    name: str | None = None
    username: str | None = None
    email: EmailStr | None = None
    password: str | None = None


from pydantic import BaseModel

class User (BaseModel):
    username : str
    email : str
    password : str
    isActive : bool

class LoginRequest(BaseModel):
    identifier: str
    password: str

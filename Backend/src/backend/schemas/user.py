
from pydantic import BaseModel

class User (BaseModel):
    username : str
    email : str
    password : str
    name : str
    isActive : bool = True

class LoginRequest(BaseModel):
    identifier: str
    password: str

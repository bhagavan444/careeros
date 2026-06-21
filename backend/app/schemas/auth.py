from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class RoleEnum(str, Enum):
    user = "User"
    recruiter = "Recruiter"
    admin = "Admin"

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: RoleEnum = RoleEnum.user

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str

# Properties to receive via API on login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Properties to return to client
class UserResponse(UserBase):
    id: str
    is_active: bool

    class Config:
        from_attributes = True

# JWT Token Response
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

# Token payload extraction
class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    type: Optional[str] = None

from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Optional, List

class ProfileBase(BaseModel):
    name: str
    summary: str
    long_summary: Optional[str] = None
    profile_photo_url: Optional[HttpUrl] = None
    github_url: Optional[HttpUrl] = None
    linkedin_url: Optional[HttpUrl] = None
    email: EmailStr
    location: str = "Vancouver, BC"

class ProfileRead(ProfileBase):
    id: int

class ProfileUpdate(BaseModel):
    # Everything is Optional for PATCH support
    name: Optional[str] = None
    summary: Optional[str] = None
    long_summary: Optional[str] = None
    profile_photo_url: Optional[HttpUrl] = None
    github_url: Optional[HttpUrl] = None
    linkedin_url: Optional[HttpUrl] = None
    email: Optional[EmailStr] = None
    location: Optional[str] = None
from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class EducationBase(BaseModel):
    institution: str
    certificate: str
    major: str
    start_date: str
    end_date: Optional[str] = None
    location: Optional[str] = "Vancouver, BC"
    description: Optional[str] = None
    is_draft: bool = False

class EducationCreate(EducationBase):
    pass

class EducationUpdate(BaseModel):
    institution: Optional[str] = None
    certificate: Optional[str] = None
    major: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    is_draft: Optional[bool] = None

class EducationRead(EducationBase):
    id: UUID
    created_at: datetime

class EducationPublicRead(BaseModel):
    id: UUID
    institution: str
    certificate: str
    major: str
    start_date: str
    end_date: Optional[str]
    location: Optional[str]
    description: Optional[str]
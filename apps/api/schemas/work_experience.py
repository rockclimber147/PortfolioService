from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from .tags import TagRead

class ExperienceBase(BaseModel):
    company: str
    role: str
    location: Optional[str] = "Vancouver, BC"
    start_date: datetime
    end_date: Optional[datetime] = None
    is_current: bool = False
    description: str
    long_description: str
    company_url: Optional[str] = None
    is_draft: bool = False

class ExperienceCreate(ExperienceBase):
    tag_ids: List[UUID] = []

class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    long_description: Optional[str] = None
    company_url: Optional[str] = None
    tag_ids: Optional[List[UUID]] = None
    is_draft: Optional[bool] = None

class ExperienceRead(ExperienceBase):
    id: UUID
    created_at: datetime
    tags: List[TagRead] = []
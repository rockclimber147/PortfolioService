from pydantic import BaseModel, HttpUrl
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from .tags import TagRead

class ProjectBase(BaseModel):
    title: str
    slug: str
    short_description: str
    thumbnail_url: Optional[HttpUrl] = None

# For Project Cards (Public Gallery View)
class ProjectSummary(ProjectBase):
    id: UUID
    created_at: datetime
    tags: List[TagRead] = []

# For the Full Detail Page (Public)
class ProjectDetail(ProjectSummary):
    challenge: str
    solution: str
    impact: str
    github_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None
    is_featured: bool


class ProjectAdminRead(ProjectDetail):
    is_draft: bool

# For the Admin Create form
class ProjectCreate(ProjectBase):
    challenge: str
    solution: str
    impact: str
    github_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None
    is_featured: bool = False
    is_draft: bool = True  # Default to draft for safety
    tag_ids: Optional[List[UUID]] = None

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    challenge: Optional[str] = None
    solution: Optional[str] = None
    impact: Optional[str] = None
    thumbnail_url: Optional[HttpUrl] = None
    github_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None
    is_featured: Optional[bool] = None
    is_draft: Optional[bool] = None
    tag_ids: Optional[List[UUID]] = None
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

# For Project Cards (Gallery View)
class ProjectSummary(ProjectBase):
    id: UUID
    created_at: datetime
    # We include a list of basic tags so the gallery can show badges
    tags: List[TagRead] = []

# For the Full Detail Page
class ProjectDetail(ProjectSummary):
    challenge: str
    solution: str
    impact: str
    github_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None
    # Inherits tags from ProjectSummary

# For the Admin Create/Update forms
class ProjectCreate(ProjectBase):
    challenge: str
    solution: str
    impact: str
    github_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None
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
    # We include tag_ids here so we can update the relationships
    tag_ids: Optional[List[UUID]] = None

from pydantic import BaseModel, HttpUrl
from uuid import UUID
from datetime import datetime
from typing import Optional, List

# --- TAG SCHEMAS ---

class TagBase(BaseModel):
    name: str
    slug: str

class TagRead(TagBase):
    id: UUID

class TagCreate(TagBase):
    pass


# --- PROJECT SCHEMAS ---

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
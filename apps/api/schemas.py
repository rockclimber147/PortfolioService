from pydantic import BaseModel, HttpUrl
from uuid import UUID
from datetime import datetime
from typing import Optional

# Base for shared validation logic
class ProjectBase(BaseModel):
    title: str
    slug: str
    short_description: str
    thumbnail_url: Optional[HttpUrl] = None

# For your Project Cards
class ProjectSummary(ProjectBase):
    id: UUID
    created_at: datetime

# For the Full Detail Page
class ProjectDetail(ProjectSummary):
    challenge: str
    solution: str
    impact: str
    github_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None

# For the Admin Create/Update forms
class ProjectCreate(ProjectBase):
    challenge: str
    solution: str
    impact: str
    github_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None
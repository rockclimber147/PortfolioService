from pydantic import BaseModel, HttpUrl, Field, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import List, Optional

# --- Technology Schemas ---
class TechnologyBase(BaseModel):
    name: str
    icon_name: Optional[str] = None

class Technology(TechnologyBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- Project Image Schemas ---
class ProjectImageBase(BaseModel):
    url: HttpUrl
    caption: Optional[str] = None
    display_order: int = 0

class ProjectImage(ProjectImageBase):
    id: int
    project_id: UUID
    model_config = ConfigDict(from_attributes=True)

# --- Project Schemas ---
class ProjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., pattern=r"^[a-z0-9-]+$")
    short_description: str = Field(..., max_length=250)
    thumbnail_url: Optional[HttpUrl] = None
    is_featured: bool = False
    

class ProjectSummary(ProjectBase):
    id: UUID
    created_at: datetime
    technologies: List[Technology] # List view usually needs the tech tags
    
    model_config = ConfigDict(from_attributes=True)

class ProjectDetail(ProjectSummary):
    challenge: Optional[str] = None
    solution: Optional[str] = None
    impact: Optional[str] = None
    github_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None
    
    # Nested heavy data
    images: List[ProjectImage] = []
    
    model_config = ConfigDict(from_attributes=True)

# 3. ProjectCreate: For your Admin CRUD (POST requests)
class ProjectCreate(ProjectBase):
    challenge: str
    solution: str
    impact: str
    github_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None
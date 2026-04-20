from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, Any, List

class ProjectTagLink(SQLModel, table=True):
    __tablename__: Any = "project_tag_links"
    
    project_id: UUID = Field(foreign_key="projects.id", primary_key=True)
    tag_id: UUID = Field(foreign_key="tags.id", primary_key=True)

class ExperienceTagLink(SQLModel, table=True):
    __tablename__: Any = "experience_tag_links"
    
    experience_id: UUID = Field(foreign_key="work_experience.id", primary_key=True)
    tag_id: UUID = Field(foreign_key="tags.id", primary_key=True)

class Tag(SQLModel, table=True):
    __tablename__: Any = "tags"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(unique=True, index=True)
    slug: str = Field(unique=True, index=True)
    
    projects: List["Project"] = Relationship(back_populates="tags", link_model=ProjectTagLink)
    experiences: List["WorkExperience"] = Relationship(back_populates="tags", link_model=ExperienceTagLink)

class Project(SQLModel, table=True):
    __tablename__ : Any = "projects"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(index=True)
    slug: str = Field(unique=True, index=True)
    short_description: str
    challenge: str
    solution: str
    impact: str
    thumbnail_url: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    is_featured: bool = False
    is_draft: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to tags
    tags: List[Tag] = Relationship(back_populates="projects", link_model=ProjectTagLink)

class Profile(SQLModel, table=True):
    id: int = Field(default=1, primary_key=True) # Always ID 1
    name: str
    summary: str
    long_summary: Optional[str] = None
    profile_photo_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    email: str
    location: str = "Vancouver, BC"


class WorkExperience(SQLModel, table=True):
    __tablename__: Any = "work_experience"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    company: str = Field(index=True)
    role: str = Field(index=True)
    location: Optional[str] = "Vancouver, BC"
    
    start_date: datetime
    end_date: Optional[datetime] = None  # None if is_current is True
    is_current: bool = False
    
    description: str  # Short summary for list views
    long_description: str  # Detailed bullet points or Markdown
    
    company_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to tags
    tags: List[Tag] = Relationship(back_populates="experiences", link_model=ExperienceTagLink)
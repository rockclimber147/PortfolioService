from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, Any, List

# 1. The Link Table (No 'table=True' in the class definition, handled by SQLModel)
class ProjectTagLink(SQLModel, table=True):
    __tablename__: Any = "project_tag_links"
    
    project_id: UUID = Field(foreign_key="projects.id", primary_key=True)
    tag_id: UUID = Field(foreign_key="tags.id", primary_key=True)

# 2. The Tag Model
class Tag(SQLModel, table=True):
    __tablename__: Any = "tags"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(unique=True, index=True)
    slug: str = Field(unique=True, index=True)
    
    # Relationship back to projects
    projects: List["Project"] = Relationship(back_populates="tags", link_model=ProjectTagLink)

# 3. Your Updated Project Model
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
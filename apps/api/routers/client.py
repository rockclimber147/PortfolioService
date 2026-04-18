from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, cast, Any
from sqlmodel import or_, col
from sqlalchemy.orm import selectinload

from database import get_session
from models import Project
from schemas import ProjectSummary, ProjectDetail

router = APIRouter(
    prefix="/projects",
    tags=["Public Projects"]
)

@router.get("/", response_model=List[ProjectSummary])
async def list_projects(
    skip: int = 0, 
    limit: int = 10,
    search: Optional[str] = None,
    session: AsyncSession = Depends(get_session)
):
    # 1. Use .options(selectinload(Project.tags)) 
    # This fetches projects AND their tags in one (or two optimized) async calls.
    statement = (
        select(Project)
        .offset(skip)
        .limit(limit)
        .options(selectinload(cast(Any, Project.tags)))
    )
    
    if search:
        search_filter = f"%{search}%"
        statement = statement.where(
            or_(
                col(Project.title).ilike(search_filter),
                col(Project.short_description).ilike(search_filter)
            )
        )
    
    result = await session.execute(statement)
    projects = result.scalars().all()
    
    return projects

@router.get("/{slug}", response_model=ProjectDetail)
async def get_project_detail(
    slug: str, 
    session: AsyncSession = Depends(get_session)
):
    """Returns the full details for a single project page by its unique slug."""
    # Find the project where the slug matches
    statement = select(Project).where(Project.slug == slug)
    result = await session.execute(statement)
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(
            status_code=404, 
            detail=f"Project with slug '{slug}' not found"
        )
    
    return project
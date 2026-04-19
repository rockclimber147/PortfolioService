from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, cast, Any
from sqlmodel import or_, col
from sqlalchemy.orm import selectinload

from schemas import TagRead
from database.database import get_session
from models import Project
from schemas import ProjectSummary, ProjectDetail
from services import ProjectService, TagService

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
    return await ProjectService.list_projects(session, skip, limit, search)

@router.get("/{slug}", response_model=ProjectDetail)
async def get_project_detail(slug: str, session: AsyncSession = Depends(get_session)):
    project = await ProjectService.get_by_slug(session, slug)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.get("/tags", response_model=List[TagRead])
async def list_tags(session: AsyncSession = Depends(get_session)):
    return await TagService.list_tags(session)
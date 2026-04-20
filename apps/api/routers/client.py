from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, cast, Any
from sqlmodel import or_, col
from sqlalchemy.orm import selectinload

from schemas import TagRead, ExperiencePublicRead, EducationPublicRead, ProfilePublicRead, TagPublicRead
from database.database import get_session
from models import Project
from schemas import ProjectSummary, ProjectDetail
from services import ProjectService, TagService, ProfileService, ExperienceService, EducationService

router = APIRouter(
    prefix="/public",
    tags=["Public"]
)

@router.get("/projects", response_model=List[ProjectSummary])
async def list_projects(
    skip: int = 0, 
    limit: int = 10,
    search: Optional[str] = None,
    session: AsyncSession = Depends(get_session)
):
    return await ProjectService.list_projects(session, skip, limit, search)

@router.get("/projects/{slug}", response_model=ProjectDetail)
async def get_project_detail(slug: str, session: AsyncSession = Depends(get_session)):
    project = await ProjectService.get_by_slug(session, slug)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.get("/profile", response_model=ProfilePublicRead)
async def get_public_profile(session: AsyncSession = Depends(get_session)):
    profile = await ProfileService.get_profile(session)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.get("/experience", response_model=List[ExperiencePublicRead])
async def list_public_experience(session: AsyncSession = Depends(get_session)):
    return await ExperienceService.get_public(session)

@router.get("/education", response_model=List[EducationPublicRead])
async def list_public_education(session: AsyncSession = Depends(get_session)):
    return await EducationService.get_public(session)

@router.get("/tags", response_model=List[TagPublicRead])
async def list_public_tags(session: AsyncSession = Depends(get_session)):
    return await TagService.get_public(session)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from sqlmodel import col, select
from sqlalchemy.orm import selectinload
from typing import List

from database import get_session
from schemas import ProjectCreate, ProjectDetail, ProjectUpdate
from services import ProjectService, TagService
from schemas import TagCreate, TagRead, TagUpdate

router = APIRouter(tags=["Admin CRUD"])

@router.post("/projects", response_model=ProjectDetail, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_in: ProjectCreate, 
    session: AsyncSession = Depends(get_session)
):
    """Creates a new project and links any provided tag IDs."""
    return await ProjectService.create_project(session, project_in)

@router.get("/projects/{project_id}", response_model=ProjectDetail)
async def get_project(
    project_id: UUID, 
    session: AsyncSession = Depends(get_session)
):
    """Fetches a single project by ID for editing."""
    db_project = await ProjectService.get_by_id(session, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project


@router.patch("/projects/{project_id}", response_model=ProjectDetail)
async def update_project(
    project_id: UUID,
    project_in: ProjectUpdate,
    session: AsyncSession = Depends(get_session)
):
    """
    Updates an existing project. 
    Only fields provided in the request body will be changed.
    """
    db_project = await ProjectService.update_project(session, project_id, project_in)
    
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Project not found"
        )
        
    return db_project


@router.post("/tags", response_model=TagRead, status_code=201)
async def create_tag(tag_in: TagCreate, session: AsyncSession = Depends(get_session)):
    return await TagService.create_tag(session, tag_in)

@router.patch("/tags/{tag_id}", response_model=TagRead)
async def update_tag(tag_id: UUID, tag_in: TagUpdate, session: AsyncSession = Depends(get_session)):
    db_tag = await TagService.update_tag(session, tag_id, tag_in)
    if not db_tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return db_tag

@router.delete("/tags/{tag_id}", status_code=204)
async def delete_tag(tag_id: UUID, session: AsyncSession = Depends(get_session)):
    success = await TagService.delete_tag(session, tag_id)
    if not success:
        raise HTTPException(status_code=404, detail="Tag not found")
    return None
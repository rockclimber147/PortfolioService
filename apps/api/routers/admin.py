from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from sqlmodel import col, select
from sqlalchemy.orm import selectinload
from typing import cast, Any

from database import get_session
from schemas import ProjectCreate, ProjectDetail, ProjectUpdate
from services.projects import ProjectService

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
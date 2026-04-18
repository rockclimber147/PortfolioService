from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from sqlmodel import col, select
from sqlalchemy.orm import selectinload
from typing import cast, Any

from database import get_session
from models import Project
from schemas import ProjectCreate, ProjectDetail

router = APIRouter(tags=["Admin CRUD"])

@router.post("/projects", response_model=ProjectDetail, status_code=201)
async def create_project(
    project_in: ProjectCreate, 
    session: AsyncSession = Depends(get_session)
):
    project_data = project_in.model_dump(mode="json")
    db_project = Project(**project_data)
    
    session.add(db_project)
    await session.commit()
    await session.refresh(db_project)
    return db_project

@router.get("/projects/{project_id}", response_model=ProjectDetail)
async def get_project(
    project_id: UUID, 
    session: AsyncSession = Depends(get_session)
):
    # Use select instead of session.get to allow for selectinload
    statement = (
        select(Project)
        .where(Project.id == project_id)
        .options(selectinload(cast(Any, Project.tags)))
    )
    
    result = await session.execute(statement)
    db_project = result.scalar_one_or_none()
    
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    return db_project
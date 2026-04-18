from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from database import get_session
from models import Project  # The DB Table
from schemas import ProjectCreate, ProjectDetail  # The DTOs

router = APIRouter(prefix="/admin/projects", tags=["Admin CRUD"])

@router.post("/", response_model=ProjectDetail, status_code=201)
async def create_project(
    project_in: ProjectCreate, 
    session: AsyncSession = Depends(get_session)
):
    # 'mode="json"' converts HttpUrl objects into plain strings 
    # and datetimes into ISO format strings.
    project_data = project_in.model_dump(mode="json")
    
    # Create the model using the dictionary
    db_project = Project(**project_data)
    
    session.add(db_project)
    await session.commit()
    await session.refresh(db_project)
    return db_project

@router.get("/{project_id}", response_model=ProjectDetail)
async def get_project(
    project_id: UUID, 
    session: AsyncSession = Depends(get_session)
):
    db_project = await session.get(Project, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project
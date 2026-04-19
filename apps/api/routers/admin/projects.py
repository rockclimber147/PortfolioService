from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List, Optional

from database import get_session
from schemas import ProjectCreate, ProjectDetail, ProjectUpdate, ProjectAdminRead
from services import ProjectService, StorageService

router = APIRouter()

@router.get("/", response_model=List[ProjectAdminRead])
async def list_projects(
    skip: int = 0, 
    limit: int = 10,
    search: Optional[str] = None,
    session: AsyncSession = Depends(get_session)
):
    return await ProjectService.list_projects(session, skip, limit, search)

@router.post("/", response_model=ProjectDetail, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_in: ProjectCreate, 
    session: AsyncSession = Depends(get_session)
):
    return await ProjectService.create_project(session, project_in)

@router.get("/{project_id}", response_model=ProjectDetail)
async def get_project(
    project_id: UUID, 
    session: AsyncSession = Depends(get_session)
):
    db_project = await ProjectService.get_by_id(session, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@router.patch("/{project_id}", response_model=ProjectDetail)
async def update_project(
    project_id: UUID,
    project_in: ProjectUpdate,
    session: AsyncSession = Depends(get_session),
    storage: StorageService = Depends()
):
    db_project = await ProjectService.update_project(session, project_id, project_in, storage)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    session: AsyncSession = Depends(get_session),
    storage: StorageService = Depends()
):
    success = await ProjectService.delete_project(session, project_id, storage)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return None
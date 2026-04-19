from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from sqlmodel import col, select
from sqlalchemy.orm import selectinload
from typing import List, Optional

from database import get_session
from schemas import ProjectCreate, ProjectDetail, ProjectUpdate, ProjectAdminRead
from services import ProjectService, TagService, StorageService
from schemas import TagCreate, TagRead, TagUpdate, UploadRequest
from envconfig import EnvironmentConfig

router = APIRouter(tags=["Admin CRUD"])
storage_service = StorageService()


@router.post("/verify")
async def verify_admin_key():
    """
    If this code is reached, the Depends(AuthService.verify_admin) 
    has already passed.
    """
    return {"status": "success"}

@router.get("/projects/", response_model=List[ProjectAdminRead])
async def list_projects(
    skip: int = 0, 
    limit: int = 10,
    search: Optional[str] = None,
    session: AsyncSession = Depends(get_session)
):
    return await ProjectService.list_projects(session, skip, limit, search)

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
    session: AsyncSession = Depends(get_session),
    storage: StorageService = Depends()
):
    # Pass storage to the service
    db_project = await ProjectService.update_project(session, project_id, project_in, storage)
    
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Project not found"
        )
        
    return db_project

@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    session: AsyncSession = Depends(get_session),
    storage: StorageService = Depends()
):
    """Deletes a project from the database."""
    success = await ProjectService.delete_project(session, project_id, storage)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Project not found or could not be deleted"
        )
    return True


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

@router.get("/tags", response_model=List[TagRead])
async def list_tags(session: AsyncSession = Depends(get_session)):
    """
    Lists all tags for the admin dashboard.
    """
    return await TagService.list_tags(session)

@router.post("/assets/upload-url")
async def get_upload_url(request: UploadRequest):
    data = storage_service.generate_presigned_upload_url(
        file_name=request.file_name,
        content_type=request.content_type
    )
    
    if not data:
        raise HTTPException(status_code=500, detail="Could not generate upload URL")
        
    return data
"""Admin API routes under /api/v1/admin."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile

from deps import get_project_service
from project_service import ProjectConflictError, ProjectService
from schemas import ProjectCreate, ProjectListResponse, ProjectRead, ProjectUpdate

router = APIRouter(tags=["admin"])


@router.get("/projects", response_model=ProjectListResponse)
def list_all_projects(
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(20, ge=1, le=100, description="Page size"),
    service: ProjectService = Depends(get_project_service),
) -> ProjectListResponse:
    """List all projects, public and private (paginated)."""
    rows, total = service.list_all(skip=skip, limit=limit)
    return ProjectListResponse(
        items=[ProjectRead.model_validate(p) for p in rows],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.post("/projects", status_code=201, response_model=ProjectRead)
def create_project(
    payload: ProjectCreate,
    service: ProjectService = Depends(get_project_service),
) -> ProjectRead:
    """Create a new project."""
    try:
        project = service.create(payload)
    except ProjectConflictError as e:
        raise HTTPException(status_code=409, detail=e.message) from e
    return ProjectRead.model_validate(project)


@router.patch("/projects/{project_id}", response_model=ProjectRead)
def update_project(
    project_id: uuid.UUID,
    payload: ProjectUpdate,
    service: ProjectService = Depends(get_project_service),
) -> ProjectRead:
    """Update project metadata and content."""
    try:
        project = service.update(project_id, payload)
    except ProjectConflictError as e:
        raise HTTPException(status_code=409, detail=e.message) from e
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectRead.model_validate(project)


@router.delete("/projects/{project_id}", status_code=204)
def delete_project(
    project_id: uuid.UUID,
    service: ProjectService = Depends(get_project_service),
) -> None:
    """Delete project and associated media rows (S3 cleanup not implemented)."""
    if not service.delete(project_id):
        raise HTTPException(status_code=404, detail="Project not found")


@router.post("/projects/{project_id}/upload", status_code=201)
async def upload_project_media(
    project_id: uuid.UUID,
    file: UploadFile = File(..., description="Image file"),
    service: ProjectService = Depends(get_project_service),
) -> dict[str, str]:
    """Upload an image to S3 and attach as a media asset."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    if service.get_by_id(project_id) is None:
        raise HTTPException(status_code=404, detail="Project not found")
    raise HTTPException(
        status_code=501,
        detail="S3 upload not implemented.",
    )

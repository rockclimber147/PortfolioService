"""Admin API routes under /api/v1/admin."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile

from schemas import ProjectCreate, ProjectUpdate

router = APIRouter(tags=["admin"])


@router.post("/projects", status_code=201)
def create_project(payload: ProjectCreate) -> dict[str, str]:
    """Create a new project."""
    raise HTTPException(
        status_code=501,
        detail="Project creation requires database session (not wired yet).",
    )


@router.patch("/projects/{project_id}")
def update_project(project_id: uuid.UUID, payload: ProjectUpdate) -> dict[str, str]:
    """Update project metadata and content."""
    raise HTTPException(
        status_code=501,
        detail="Project update requires database session (not wired yet).",
    )


@router.delete("/projects/{project_id}")
def delete_project(project_id: uuid.UUID) -> None:
    """Delete project and associated S3 assets."""
    raise HTTPException(
        status_code=501,
        detail="Project deletion requires database and S3 (not wired yet).",
    )


@router.post("/projects/{project_id}/upload", status_code=201)
async def upload_project_media(
    project_id: uuid.UUID,
    file: UploadFile = File(..., description="Image file"),
) -> dict[str, str]:
    """Upload an image to S3 and attach as a media asset."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    raise HTTPException(
        status_code=501,
        detail="S3 upload not implemented.",
    )

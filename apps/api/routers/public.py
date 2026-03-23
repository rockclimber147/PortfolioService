"""Public (client-web) API routes under /api/v1."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query

from deps import get_project_service
from models import Project
from project_service import ProjectService
from schemas import (
    MediaAssetRead,
    ProjectDetailRead,
    ProjectListResponse,
    ProjectRead,
    ProjectSearchResponse,
)

router = APIRouter(tags=["public"])


def _project_to_detail(project: Project) -> ProjectDetailRead:
    base = ProjectRead.model_validate(project)
    media_sorted = sorted(project.media_assets, key=lambda m: m.display_order)
    return ProjectDetailRead(
        **base.model_dump(),
        media_assets=[MediaAssetRead.model_validate(m) for m in media_sorted],
    )


@router.get("/projects", response_model=ProjectListResponse)
def list_public_projects(
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(20, ge=1, le=100, description="Page size"),
    service: ProjectService = Depends(get_project_service),
) -> ProjectListResponse:
    """List projects where `is_public=true` (paginated)."""
    rows, total = service.list_public(skip=skip, limit=limit)
    return ProjectListResponse(
        items=[ProjectRead.model_validate(p) for p in rows],
        total=total,
        skip=skip,
        limit=limit,
    )


@router.get("/projects/{slug}", response_model=ProjectDetailRead)
def get_project_by_slug(
    slug: str,
    service: ProjectService = Depends(get_project_service),
) -> ProjectDetailRead:
    """Return full project details by URL slug."""
    project = service.get_public_by_slug(slug)
    if project is None:
        raise HTTPException(status_code=404, detail=f"Project not found: {slug}")
    return _project_to_detail(project)


@router.get("/search", response_model=ProjectSearchResponse)
def search_projects(
    q: str = Query(..., min_length=1, description="Search title and tags"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    service: ProjectService = Depends(get_project_service),
) -> ProjectSearchResponse:
    """Search public projects by title or tags."""
    rows, total = service.search_public(q=q, skip=skip, limit=limit)
    return ProjectSearchResponse(
        items=[ProjectRead.model_validate(p) for p in rows],
        total=total,
        q=q,
        skip=skip,
        limit=limit,
    )

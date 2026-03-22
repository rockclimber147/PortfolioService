"""Public (client-web) API routes under /api/v1."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException, Query

router = APIRouter(tags=["public"])


@router.get("/projects")
def list_public_projects(
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(20, ge=1, le=100, description="Page size"),
) -> dict[str, Any]:
    """List projects where `is_public=true` (paginated). Database wiring pending."""
    return {"items": [], "total": 0, "skip": skip, "limit": limit}


@router.get("/projects/{slug}")
def get_project_by_slug(slug: str) -> dict[str, Any]:
    """Return full project details by URL slug."""
    raise HTTPException(
        status_code=404,
        detail=f"Project not found: {slug}",
    )


@router.get("/search")
def search_projects(
    q: str = Query(..., min_length=1, description="Search title and tags"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
) -> dict[str, Any]:
    """Search public projects by title or tags."""
    return {"items": [], "q": q, "skip": skip, "limit": limit}

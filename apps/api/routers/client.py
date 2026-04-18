from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from schemas import ProjectSummary, ProjectDetail

router = APIRouter(
    prefix="/projects",
    tags=["Public Projects"]
)

@router.get("/", response_model=List[ProjectSummary])
def list_projects(
    skip: int = 0, 
    limit: int = 10,
    tag: Optional[str] = None
):
    """Returns a paginated list of project cards for the main gallery."""
    # TODO: Implement Supabase select with pagination
    return []

@router.get("/{slug}", response_model=ProjectDetail)
def get_project_detail(slug: str):
    """Returns the full details for a single project page."""
    # TODO: Implement Supabase filter by slug
    return {}
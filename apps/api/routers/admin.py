from fastapi import APIRouter, Depends, HTTPException
from typing import List
from schemas import ProjectDetail, ProjectCreate

router = APIRouter(
    prefix="/admin/projects",
    tags=["Admin CRUD"]
)

@router.post("/", response_model=ProjectDetail, status_code=201)
def create_project(project: ProjectCreate):
    """Create a new project entry."""
    # TODO: Implement Supabase insert
    return {}

@router.put("/{project_id}", response_model=ProjectDetail)
def update_project(project_id: str, project: ProjectCreate):
    """Update an existing project's metadata or details."""
    # TODO: Implement Supabase update
    return {}

@router.delete("/{project_id}", status_code=204)
def delete_project(project_id: str):
    """Remove a project from the database."""
    # TODO: Implement Supabase delete
    return None
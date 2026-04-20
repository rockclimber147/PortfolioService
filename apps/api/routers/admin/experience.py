from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List

from database.database import get_session
from schemas import ExperienceRead, ExperienceCreate, ExperienceUpdate
from services.work_experience import ExperienceService

router = APIRouter()

@router.get("/", response_model=List[ExperienceRead])
async def list_experiences(
    session: AsyncSession = Depends(get_session)
):
    """
    Lists all work experiences for the admin dashboard.
    """
    return await ExperienceService.list_experiences(session)

@router.post("/", response_model=ExperienceRead, status_code=status.HTTP_201_CREATED)
async def create_experience(
    exp_in: ExperienceCreate, 
    session: AsyncSession = Depends(get_session)
):
    """
    Creates a new work experience entry with optional tag links.
    """
    return await ExperienceService.create_experience(session, exp_in)

@router.patch("/{exp_id}", response_model=ExperienceRead)
async def update_experience(
    exp_id: UUID,
    exp_in: ExperienceUpdate,
    session: AsyncSession = Depends(get_session)
):
    """
    Updates an existing work experience, including its tag relationships.
    """
    db_exp = await ExperienceService.update_experience(session, exp_id, exp_in)
    if not db_exp:
        raise HTTPException(status_code=404, detail="Work experience not found")
    return db_exp

@router.delete("/{exp_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_experience(
    exp_id: UUID,
    session: AsyncSession = Depends(get_session)
):
    """
    Permanently removes a work experience entry.
    """
    success = await ExperienceService.delete_experience(session, exp_id)
    if not success:
        raise HTTPException(status_code=404, detail="Work experience not found")
    return None
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from database.database import get_session
from schemas import ProfileRead, ProfileUpdate
from services import ProfileService

router = APIRouter(prefix="/profile", tags=["Admin Profile"])

@router.get("/", response_model=ProfileRead)
async def get_my_profile(session: AsyncSession = Depends(get_session)):
    """
    Fetches the singleton profile record.
    If it doesn't exist yet, returns a 404 or a default state.
    """
    db_profile = await ProfileService.get_profile(session)
    if not db_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Profile not initialized."
        )
    return db_profile

@router.patch("/", response_model=ProfileRead)
async def update_my_profile(
    profile_in: ProfileUpdate, 
    session: AsyncSession = Depends(get_session)
):
    """
    Updates the singleton profile. 
    Creates it if it doesn't exist (ID 1).
    """
    return await ProfileService.update_profile(session, profile_in)
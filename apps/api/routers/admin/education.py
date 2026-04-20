from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List

from database.database import get_session
from schemas import EducationRead, EducationCreate, EducationUpdate
from services.education import EducationService

router = APIRouter()

@router.get("/", response_model=List[EducationRead])
async def list_education(session: AsyncSession = Depends(get_session)):
    return await EducationService.list_education(session)

@router.post("/", response_model=EducationRead, status_code=status.HTTP_201_CREATED)
async def create_education(edu_in: EducationCreate, session: AsyncSession = Depends(get_session)):
    return await EducationService.create_education(session, edu_in)

@router.patch("/{edu_id}", response_model=EducationRead)
async def update_education(
    edu_id: UUID, 
    edu_in: EducationUpdate, 
    session: AsyncSession = Depends(get_session)
):
    db_edu = await EducationService.update_education(session, edu_id, edu_in)
    if not db_edu:
        raise HTTPException(status_code=404, detail="Education record not found")
    return db_edu

@router.delete("/{edu_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_education(edu_id: UUID, session: AsyncSession = Depends(get_session)):
    success = await EducationService.delete_education(session, edu_id)
    if not success:
        raise HTTPException(status_code=404, detail="Education record not found")
    return None
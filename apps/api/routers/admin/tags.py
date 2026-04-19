from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List

from database.database import get_session
from schemas import TagCreate, TagRead, TagUpdate
from services import TagService

router = APIRouter()

@router.get("/", response_model=List[TagRead])
async def list_tags(session: AsyncSession = Depends(get_session)):
    return await TagService.list_tags(session)

@router.post("/", response_model=TagRead, status_code=status.HTTP_201_CREATED)
async def create_tag(
    tag_in: TagCreate, 
    session: AsyncSession = Depends(get_session)
):
    return await TagService.create_tag(session, tag_in)

@router.patch("/{tag_id}", response_model=TagRead)
async def update_tag(
    tag_id: UUID, 
    tag_in: TagUpdate, 
    session: AsyncSession = Depends(get_session)
):
    db_tag = await TagService.update_tag(session, tag_id, tag_in)
    if not db_tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return db_tag

@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tag(
    tag_id: UUID, 
    session: AsyncSession = Depends(get_session)
):
    success = await TagService.delete_tag(session, tag_id)
    if not success:
        raise HTTPException(status_code=404, detail="Tag not found")
    return None
from uuid import UUID
from typing import List, Optional, Any, cast
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlmodel import select, col

from models import Tag, Project
from schemas.tags import TagCreate, TagUpdate

class TagService:
    @staticmethod
    async def create_tag(session: AsyncSession, tag_in: TagCreate) -> Tag:
        db_tag = Tag(**tag_in.model_dump())
        session.add(db_tag)
        await session.commit()
        await session.refresh(db_tag)
        return db_tag

    @staticmethod
    async def list_tags(session: AsyncSession) -> List[Tag]:
        statement = select(Tag).order_by(Tag.name)
        result = await session.execute(statement)
        return list(result.scalars().all())

    @staticmethod
    async def get_tag_by_id(session: AsyncSession, tag_id: UUID, include_projects: bool = False) -> Optional[Tag]:
        statement = select(Tag).where(Tag.id == tag_id)
        if include_projects:
            # Eager load projects if we're looking at a specific tag detail
            statement = statement.options(selectinload(cast(Any, Tag.projects)))
        
        result = await session.execute(statement)
        return result.scalar_one_or_none()

    @staticmethod
    async def update_tag(session: AsyncSession, tag_id: UUID, tag_in: TagUpdate) -> Optional[Tag]:
        db_tag = await TagService.get_tag_by_id(session, tag_id)
        if not db_tag:
            return None
        
        update_data = tag_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_tag, key, value)
            
        session.add(db_tag)
        await session.commit()
        await session.refresh(db_tag)
        return db_tag

    @staticmethod
    async def delete_tag(session: AsyncSession, tag_id: UUID) -> bool:
        db_tag = await TagService.get_tag_by_id(session, tag_id)
        if not db_tag:
            return False
            
        await session.delete(db_tag)
        await session.commit()
        return True
    
    @staticmethod
    async def get_public(session: AsyncSession) -> List[Tag]:
        statement = (
            select(Tag)
            .where(col(Tag.is_draft) == False)
            .order_by(col(Tag.name).asc())
        )
        
        result = await session.execute(statement)
        return list(result.scalars().all())
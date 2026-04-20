from datetime import datetime

from sqlalchemy import desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlmodel import col, select
from uuid import UUID
from typing import List, Optional, Any, cast

from models import WorkExperience, Tag
from schemas import ExperienceCreate, ExperienceUpdate

class ExperienceService:
    @staticmethod
    async def list_experiences(session: AsyncSession) -> List[WorkExperience]:
        statement = select(WorkExperience).options(selectinload(cast(Any, WorkExperience.tags))).order_by(desc(col(WorkExperience.start_date)))
        result = await session.execute(statement)
        return list(result.scalars().all())

    @staticmethod
    async def create_experience(session: AsyncSession, exp_in: ExperienceCreate) -> WorkExperience:
        data = exp_in.model_dump(exclude={"tag_ids"})
        
        # Keep your date-stripping logic here if Postgres still complains
        for key in ["start_date", "end_date"]:
            val = data.get(key)
            if isinstance(val, datetime) and val.tzinfo is not None:
                data[key] = val.replace(tzinfo=None)

        db_exp = WorkExperience(**data)
        
        if exp_in.tag_ids:
            tag_statement = select(Tag).where(col(Tag.id).in_(exp_in.tag_ids))
            tags = await session.execute(tag_statement)
            db_exp.tags = list(tags.scalars().all())

        session.add(db_exp)
        await session.commit()
        
        statement = (
            select(WorkExperience)
            .where(col(WorkExperience.id) == db_exp.id)
            .options(selectinload(cast(Any, WorkExperience.tags)))
        )
        result = await session.execute(statement)
        return result.scalar_one()

    @staticmethod
    async def update_experience(session: AsyncSession, exp_id: UUID, exp_in: ExperienceUpdate) -> Optional[WorkExperience]:
        statement = select(WorkExperience).where(WorkExperience.id == exp_id).options(selectinload(cast(Any, WorkExperience.tags)))
        result = await session.execute(statement)
        db_exp = result.scalar_one_or_none()
        
        if not db_exp:
            return None

        # Update standard fields
        update_data = exp_in.model_dump(exclude={"tag_ids"}, exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_exp, key, value)

        # Sync Tags if provided
        if exp_in.tag_ids is not None:
            tag_statement = select(Tag).where(col(Tag.id).in_(exp_in.tag_ids))
            tags = await session.execute(tag_statement)
            db_exp.tags = list(tags.scalars().all())

        session.add(db_exp)
        await session.commit()
        await session.refresh(db_exp)
        return db_exp

    @staticmethod
    async def delete_experience(session: AsyncSession, exp_id: UUID) -> bool:
        statement = select(WorkExperience).where(WorkExperience.id == exp_id)
        result = await session.execute(statement)
        db_exp = result.scalar_one_or_none()
        
        if not db_exp:
            return False
            
        await session.delete(db_exp)
        await session.commit()
        return True
    
    @staticmethod
    async def get_public(session: AsyncSession) -> List[WorkExperience]:
        statement = (
            select(WorkExperience)
            .where(col(WorkExperience.is_draft) == False) # Standardized check
            .options(selectinload(cast(Any, WorkExperience.tags)))
            .order_by(col(WorkExperience.start_date).desc())
        )
        result = await session.execute(statement)
        return list(result.scalars().all())
# apps/api/services/education.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, col
from uuid import UUID
from typing import List, Optional
from models import Education
from schemas import EducationCreate, EducationUpdate

class EducationService:
    @staticmethod
    async def list_education(session: AsyncSession) -> List[Education]:
        # We'll order by created_at or you could order by start_date string
        statement = select(Education).order_by(col(Education.created_at).desc())
        result = await session.execute(statement)
        return list(result.scalars().all())

    @staticmethod
    async def get_by_id(session: AsyncSession, edu_id: UUID) -> Optional[Education]:
        return await session.get(Education, edu_id)

    @staticmethod
    async def create_education(session: AsyncSession, edu_in: EducationCreate) -> Education:
        db_edu = Education(**edu_in.model_dump())
        session.add(db_edu)
        await session.commit()
        await session.refresh(db_edu)
        return db_edu

    @staticmethod
    async def update_education(
        session: AsyncSession, 
        edu_id: UUID, 
        edu_in: EducationUpdate
    ) -> Optional[Education]:
        db_edu = await session.get(Education, edu_id)
        if not db_edu:
            return None

        update_data = edu_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_edu, key, value)

        session.add(db_edu)
        await session.commit()
        await session.refresh(db_edu)
        return db_edu

    @staticmethod
    async def delete_education(session: AsyncSession, edu_id: UUID) -> bool:
        db_edu = await session.get(Education, edu_id)
        if not db_edu:
            return False
        await session.delete(db_edu)
        await session.commit()
        return True
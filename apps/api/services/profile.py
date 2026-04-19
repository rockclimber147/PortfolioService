from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from models import Profile
from schemas import ProfileUpdate

class ProfileService:
    @staticmethod
    async def get_profile(session: AsyncSession) -> Optional[Profile]:
        result = await session.execute(select(Profile).where(Profile.id == 1))
        return result.scalar_one_or_none()

    @staticmethod
    async def update_profile(session: AsyncSession, profile_in: ProfileUpdate) -> Profile:
        db_profile = await ProfileService.get_profile(session)   
        update_data = profile_in.model_dump(exclude_unset=True, mode="json")

        if not db_profile:
            db_profile = Profile(id=1, **update_data)
            session.add(db_profile)
        else:
            for key, value in update_data.items():
                setattr(db_profile, key, value)
            session.add(db_profile)

        await session.commit()
        await session.refresh(db_profile)
        return db_profile
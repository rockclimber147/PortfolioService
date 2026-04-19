from sqlmodel import select
from models import Profile
from sqlalchemy.ext.asyncio import AsyncSession



async def initialize_singleton_profile(session: AsyncSession):
    """
    Ensures a Profile record with ID 1 exists.
    Does nothing if it already exists to avoid overwriting user data.
    """
    statement = select(Profile).where(Profile.id == 1)
    result = await session.execute(statement)
    profile = result.scalar_one_or_none()

    if not profile:
        print("Initializing default profile record (ID 1)...")
        default_profile = Profile(
            id=1,
            name="Name",
            summary="Software Developer",
            long_summary="",
            email="your-email@example.com",
            location="Vancouver, BC",
        )
        session.add(default_profile)
        await session.commit()
    else:
        print("Profile record already exists.")
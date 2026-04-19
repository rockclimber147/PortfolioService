from uuid import UUID
from typing import List, Optional, Any, cast
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlmodel import select, or_, col

from models import Project, Tag
from schemas import ProjectCreate, ProjectUpdate

class ProjectService:
    @staticmethod
    async def list_projects(
        session: AsyncSession, 
        skip: int = 0, 
        limit: int = 10, 
        search: Optional[str] = None
    ) -> List[Project]:
        statement = (
            select(Project)
            .offset(skip)
            .limit(limit)
            .options(selectinload(cast(Any, Project.tags)))
        )
        
        if search:
            search_filter = f"%{search}%"
            statement = statement.where(
                or_(
                    col(Project.title).ilike(search_filter),
                    col(Project.short_description).ilike(search_filter)
                )
            )
        
        result = await session.execute(statement)
        return list(result.scalars().all())

    @staticmethod
    async def get_by_slug(session: AsyncSession, slug: str) -> Optional[Project]:
        statement = (
            select(Project)
            .where(Project.slug == slug)
            .options(selectinload(cast(Any, Project.tags)))
        )
        result = await session.execute(statement)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_id(session: AsyncSession, project_id: UUID) -> Optional[Project]:
        statement = (
            select(Project)
            .where(Project.id == project_id)
            .options(selectinload(cast(Any, Project.tags)))
        )
        result = await session.execute(statement)
        return result.scalar_one_or_none()

    @staticmethod
    async def create_project(session: AsyncSession, project_in: ProjectCreate) -> Project:
        # 1. Prepare core project data (exclude tag_ids for the Project model init)
        project_data = project_in.model_dump(mode="json", exclude={"tag_ids"})
        db_project = Project(**project_data)
        
        # 2. Link existing Tags if IDs were provided
        if project_in.tag_ids:
            tag_statement = select(Tag).where(col(Tag.id).in_(project_in.tag_ids))
            tag_result = await session.execute(tag_statement)
            db_project.tags = list(tag_result.scalars().all())

        session.add(db_project)
        await session.commit()
        
        # 3. Refresh with tags loaded to avoid MissingGreenlet in the response
        # We re-fetch with selectinload because session.refresh() doesn't eager load relationships
        return await ProjectService.get_by_id(session, db_project.id) # type: ignore
    
    @staticmethod
    async def update_project(
        session: AsyncSession, 
        project_id: UUID, 
        project_in: ProjectUpdate # A schema with all Optional fields
    ) -> Optional[Project]:
        # 1. Fetch the existing project with tags eager-loaded
        db_project = await ProjectService.get_by_id(session, project_id)
        if not db_project:
            return None

        # 2. Update standard fields
        update_data = project_in.model_dump(exclude_unset=True, exclude={"tag_ids"}, mode="json")
        for key, value in update_data.items():
            setattr(db_project, key, value)

        # 3. Handle Tag synchronization
        if project_in.tag_ids is not None:
            # Fetch the new Tag objects from the DB
            tag_statement = select(Tag).where(col(Tag.id).in_(project_in.tag_ids))
            tag_result = await session.execute(tag_statement)
            new_tags = list(tag_result.scalars().all())
            
            # Overwrite the relationship list. 
            # SQLAlchemy/SQLModel automatically handles deleting old links 
            # in the 'project_tag_links' table and creating new ones.
            db_project.tags = new_tags

        session.add(db_project)
        await session.commit()
        
        # Re-fetch to ensure everything is fresh for the response
        return await ProjectService.get_by_id(session, project_id)
    
    @staticmethod
    async def delete_project(session: AsyncSession, project_id: UUID) -> bool:
        """
        Deletes a project by ID. 
        Returns True if deleted, False if not found.
        """
        # Fetch the existing project first
        statement = select(Project).where(Project.id == project_id)
        result = await session.execute(statement)
        db_project = result.scalar_one_or_none()

        if not db_project:
            return False

        await session.delete(db_project)
        await session.commit()
        return True